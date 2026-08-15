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
    findById(id) {
        return prisma.task.findUnique({
            where: { id },
            include: {
                column: true,
            },
        });
    },
    findByColumnId(columnId) {
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
    countTasksPerColumn(boardId) {
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
    findByPriority(priority) {
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
    create(data) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                columnId: data.columnId,
            },
        });
    },
    update(id, data) {
        return prisma.task.update({
            where: { id },
            data,
        });
    },
    move(id, columnId) {
        return prisma.task.update({
            where: { id },
            data: {
                columnId,
            },
        });
    },
    delete(id) {
        return prisma.task.delete({
            where: { id },
        });
    },
};
