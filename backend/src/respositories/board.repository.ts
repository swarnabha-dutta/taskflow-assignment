import { prisma } from "../config/prisma.js";

export const boardRepository = {
    findAll() {
        return prisma.board.findMany({
            orderBy: {
                createdAt: "asc",
            },
            include: {
                columns: {
                    orderBy: {
                        position: "asc",
                    },
                },
            },
        });
    },

    findById(id: string) {
        return prisma.board.findUnique({
            where: { id },
            include: {
                columns: {
                    orderBy: {
                        position: "asc",
                    },
                },
            },
        });
    },

    create(name: string) {
        return prisma.board.create({
            data: {
                name,
            },
        });
    },

    update(id: string, name: string) {
        return prisma.board.update({
            where: { id },
            data: {
                name,
            },
        });
    },

    delete(id: string) {
        return prisma.board.delete({
            where: { id },
        });
    },
};