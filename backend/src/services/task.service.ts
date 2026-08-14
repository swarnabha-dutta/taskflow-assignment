import { Priority } from "../generated/prisma/client.js";
import { taskRepository } from "../respositories/task.repository.js"
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
            throw new Error("Task title is required");
        }

        const column = await columnRepository.findById(data.columnId);

        if (!column) {
            throw new Error("Column not found");
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

        if (data.title !== undefined) {
            data.title = data.title.trim();

            if (!data.title) {
                throw new Error("Task title cannot be empty");
            }
        }

        if (data.description !== undefined) {
            data.description = data.description.trim();
        }

        return taskRepository.update(id, data);
    },

    async moveTask(id: string, targetColumnId: string) {
        await this.getTaskById(id);

        const targetColumn =
            await columnRepository.findById(targetColumnId);

        if (!targetColumn) {
            throw new AppError("Target column not found", 404);
        }

        return taskRepository.move(id, targetColumnId);
    },

    async deleteTask(id: string) {
        await this.getTaskById(id);

        return taskRepository.delete(id);
    },
};