import { Priority } from "../generated/prisma/client.js";
import { taskRepository } from "../respositories/task.repository.js";
import { columnRepository } from "../respositories/column.repository.js";
import { AppError } from "../utils/AppError.js";

export const taskService = {
    async getAllTasks() {
        return taskRepository.findAll();
    },

    async getTaskById(id: string) {
        const task = await taskRepository.findById(id);

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return task;
    },

    async getTasksByColumn(columnId: string) {
        const column = await columnRepository.findById(columnId);

        if (!column) {
            throw new AppError("Column not found", 404);
        }

        return taskRepository.findByColumnId(columnId);
    },

    async getTasksByPriority(priority: Priority) {
        return taskRepository.findByPriority(priority);
    },

    async createTask(data: {
        title: string;
        description?: string;
        priority?: Priority;
        columnId: string;
    }) {
        const title = data.title.trim();

        if (!title) {
            throw new AppError("Task title is required", 400);
        }

        const column = await columnRepository.findById(data.columnId);

        if (!column) {
            throw new AppError("Column not found", 404);
        }

        return taskRepository.create({
            title,
            description: data.description?.trim(),
            priority: data.priority ?? Priority.MEDIUM,
            columnId: data.columnId,
        });
    },

    async updateTask(
        id: string,
        data: {
            title?: string;
            description?: string;
            priority?: Priority;
        },
    ) {
        await this.getTaskById(id);

        const updateData = {
            ...(data.title !== undefined && {
                title: data.title.trim(),
            }),
            ...(data.description !== undefined && {
                description: data.description.trim(),
            }),
            ...(data.priority !== undefined && {
                priority: data.priority,
            }),
        };

        if (
            updateData.title !== undefined &&
            !updateData.title
        ) {
            throw new AppError(
                "Task title cannot be empty",
                400,
            );
        }

        return taskRepository.update(id, updateData);
    },

    async moveTask(id: string, targetColumnId: string) {
        await this.getTaskById(id);

        const targetColumn =
            await columnRepository.findById(targetColumnId);

        if (!targetColumn) {
            throw new AppError(
                "Target column not found",
                404,
            );
        }

        return taskRepository.move(id, targetColumnId);
    },

    async deleteTask(id: string) {
        await this.getTaskById(id);

        return taskRepository.delete(id);
    },
};