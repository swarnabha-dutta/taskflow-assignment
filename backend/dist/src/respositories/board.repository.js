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
    findById(id) {
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
    create(name) {
        return prisma.board.create({
            data: {
                name,
            },
        });
    },
    update(id, name) {
        return prisma.board.update({
            where: { id },
            data: {
                name,
            },
        });
    },
    delete(id) {
        return prisma.board.delete({
            where: { id },
        });
    },
};
