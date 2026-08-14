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
