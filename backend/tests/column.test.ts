import { beforeAll, afterAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

describe("Column API", () => {
    let boardId: string;
    let columnId: string;

    beforeAll(async () => {
        await prisma.task.deleteMany();
        await prisma.column.deleteMany();
        await prisma.board.deleteMany();

        const board = await prisma.board.create({
            data: {
                name: "Column Test Board",
            },
        });

        boardId = board.id;
    });

    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.column.deleteMany();
        await prisma.board.deleteMany();

        await prisma.$disconnect();
    });

    describe("POST /api/columns/board/:boardId", () => {
        it("should create a new column", async () => {
            const response = await request(app)
                .post(`/api/columns/board/${boardId}`)
                .send({
                    name: "To Do",
                    position: 0,
                });

            expect(response.status).toBe(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.name).toBe("To Do");
            expect(response.body.data.position).toBe(0);
            expect(response.body.data.boardId).toBe(boardId);

            columnId = response.body.data.id;
        });

        it("should reject an empty column name", async () => {
            const response = await request(app)
                .post(`/api/columns/board/${boardId}`)
                .send({
                    name: "",
                    position: 1,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should reject a negative position", async () => {
            const response = await request(app)
                .post(`/api/columns/board/${boardId}`)
                .send({
                    name: "Invalid Column",
                    position: -1,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should return 404 for a non-existing board", async () => {
            const response = await request(app)
                .post("/api/columns/board/non-existing-board")
                .send({
                    name: "To Do",
                    position: 0,
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/columns/board/:boardId", () => {
        it("should return all columns for a board", async () => {
            const response = await request(app)
                .get(`/api/columns/board/${boardId}`);

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);

            expect(response.body.data[0].boardId).toBe(boardId);
        });
    });

    describe("GET /api/columns/:id", () => {
        it("should return a column by id", async () => {
            const response = await request(app)
                .get(`/api/columns/${columnId}`);

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(columnId);
            expect(response.body.data.name).toBe("To Do");
        });

        it("should return 404 for a non-existing column", async () => {
            const response = await request(app)
                .get("/api/columns/non-existing-column");

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe("PATCH /api/columns/:id", () => {
        it("should update a column", async () => {
            const column = await prisma.column.create({
                data: {
                    boardId,
                    name: "Update Me",
                    position: 2,
                },
            });

            const response = await request(app)
                .patch(`/api/columns/${column.id}`)
                .send({
                    name: "In Progress",
                    position: 1,
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(column.id);
            expect(response.body.data.name).toBe("In Progress");
            expect(response.body.data.position).toBe(1);
        });

        it("should reject an empty column name", async () => {
            const column = await prisma.column.create({
                data: {
                    boardId,
                    name: "Empty Name Test",
                    position: 3,
                },
            });

            const response = await request(app)
                .patch(`/api/columns/${column.id}`)
                .send({
                    name: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should reject a negative position", async () => {
            const column = await prisma.column.create({
                data: {
                    boardId,
                    name: "Position Test",
                    position: 4,
                },
            });

            const response = await request(app)
                .patch(`/api/columns/${column.id}`)
                .send({
                    position: -1,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("DELETE /api/columns/:id", () => {
        it("should delete the column", async () => {
            const column = await prisma.column.create({
                data: {
                    boardId,
                    name: "Delete Me",
                    position: 5,
                },
            });

            const response = await request(app)
                .delete(`/api/columns/${column.id}`);

            expect(response.status).toBe(204);

            const deletedColumn = await prisma.column.findUnique({
                where: {
                    id: column.id,
                },
            });

            expect(deletedColumn).toBeNull();
        });

        it("should return 404 when deleting a non-existing column", async () => {
            const response = await request(app)
                .delete("/api/columns/non-existing-column");

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });
});