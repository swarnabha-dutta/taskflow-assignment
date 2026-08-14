import { prisma } from "../config/prisma.js";
export const columnRepository = {
    findByBoardId(boardId) {
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
    findById(id) {
        return prisma.column.findUnique({
            where: { id },
            include: {
                tasks: true,
            },
        });
    },
    create(boardId, name, position) {
        return prisma.column.create({
            data: {
                boardId,
                name,
                position,
            },
        });
    },
    update(id, data) {
        return prisma.column.update({
            where: { id },
            data,
        });
    },
    delete(id) {
        return prisma.column.delete({
            where: { id },
        });
    },
};
