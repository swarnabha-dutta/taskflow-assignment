import { beforeAll, afterAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

describe("Board API", () => {
    let boardId: string;

    beforeAll(async () => {
        await prisma.task.deleteMany();
        await prisma.column.deleteMany();
        await prisma.board.deleteMany();
    });

    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.column.deleteMany();
        await prisma.board.deleteMany();

        await prisma.$disconnect();
    });

    describe("POST /api/boards", () => {
        it("should create a new board", async () => {
            const response = await request(app)
                .post("/api/boards")
                .send({
                    name: "Test Board",
                });

            expect(response.status).toBe(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.name).toBe("Test Board");
            expect(response.body.data.id).toBeDefined();

            boardId = response.body.data.id;
        });

        it("should reject an empty board name", async () => {
            const response = await request(app)
                .post("/api/boards")
                .send({
                    name: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/boards", () => {
        it("should return all boards", async () => {
            const response = await request(app)
                .get("/api/boards");

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);

            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/boards/:id", () => {
        it("should return a board by id", async () => {
            const response = await request(app)
                .get(`/api/boards/${boardId}`);

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(boardId);
            expect(response.body.data.name).toBe("Test Board");
        });

        it("should return 404 for a non-existing board", async () => {
            const response = await request(app)
                .get("/api/boards/non-existing-board");

            expect(response.status).toBe(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe("PATCH /api/boards/:id", () => {
        it("should update a board", async () => {
            const response = await request(app)
                .patch(`/api/boards/${boardId}`)
                .send({
                    name: "Updated Test Board",
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(boardId);
            expect(response.body.data.name).toBe(
                "Updated Test Board",
            );
        });

        it("should reject an empty board name", async () => {
            const response = await request(app)
                .patch(`/api/boards/${boardId}`)
                .send({
                    name: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("DELETE /api/boards/:id", () => {
        it("should delete the board", async () => {
            const response = await request(app)
                .delete(`/api/boards/${boardId}`);

            expect(response.status).toBe(204);
        });

        it("should return 404 when deleting a non-existing board", async () => {
            const response = await request(app)
                .delete(`/api/boards/${boardId}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });
});