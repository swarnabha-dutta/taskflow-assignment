import { Priority } from "../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";

export const taskRepository = {
    findAll() {
        return prisma.task.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                column: true,
            },
        });
    },

    findById(id: string) {
        return prisma.task.findUnique({
            where: { id },
            include: {
                column: true,
            },
        });
    },

    findByColumnId(columnId: string) {
        return prisma.task.findMany({
            where: {
                columnId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    /**
     * Returns every column of a board together with its task count.
     * The count is calculated by Prisma at the database layer.
     */
    countTasksPerColumn(boardId: string) {
        return prisma.column.findMany({
            where: {
                boardId,
            },
            select: {
                id: true,
                name: true,
                position: true,
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
            orderBy: {
                position: "asc",
            },
        });
    },

    /**
     * Returns tasks with the requested priority,
     * newest tasks first.
     */
    findByPriority(priority: Priority) {
        return prisma.task.findMany({
            where: {
                priority,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                column: true,
            },
        });
    },

    create(data: {
        title: string;
        description?: string;
        priority?: Priority;
        columnId: string;
    }) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                columnId: data.columnId,
            },
        });
    },

    update(
        id: string,
        data: {
            title?: string;
            description?: string;
            priority?: Priority;
        },
    ) {
        return prisma.task.update({
            where: { id },
            data,
        });
    },

    move(id: string, columnId: string) {
        return prisma.task.update({
            where: { id },
            data: {
                columnId,
            },
        });
    },

    delete(id: string) {
        return prisma.task.delete({
            where: { id },
        });
    },
};