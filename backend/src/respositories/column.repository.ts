import { prisma } from "../config/prisma.js";

export const columnRepository = {
    findByBoardId(boardId: string) {
        return prisma.column.findMany({
            where: {
                boardId,
            },
            orderBy: {
                position: "asc",
            },
            include: {
                tasks: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
    },

    findById(id: string) {
        return prisma.column.findUnique({
            where: { id },
            include: {
                tasks: true,
            },
        });
    },

    create(boardId: string, name: string, position: number) {
        return prisma.column.create({
            data: {
                boardId,
                name,
                position,
            },
        });
    },

    update(id: string, data: { name?: string; position?: number }) {
        return prisma.column.update({
            where: { id },
            data,
        });
    },

    delete(id: string) {
        return prisma.column.delete({
            where: { id },
        });
    },
};