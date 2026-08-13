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