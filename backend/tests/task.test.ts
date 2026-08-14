import {
    beforeAll,
    afterAll,
    describe,
    expect,
    it,
} from "vitest";

import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/config/prisma.js";
import { Priority } from "../src/generated/prisma/client.js";

describe("Task API", () => {
    let boardId: string;
    let todoColumnId: string;
    let doneColumnId: string;
    let taskId: string;

    beforeAll(async () => {
        // Clean database
        await prisma.task.deleteMany();
        await prisma.column.deleteMany();
        await prisma.board.deleteMany();

        // Create test board
        const board = await prisma.board.create({
            data: {
                name: "Task Test Board",
            },
        });

        boardId = board.id;

        // Create first column
        const todoColumn = await prisma.column.create({
            data: {
                name: "Todo",
                position: 0,
                boardId,
            },
        });

        todoColumnId = todoColumn.id;

        // Create second column
        const doneColumn = await prisma.column.create({
            data: {
                name: "Done",
                position: 1,
                boardId,
            },
        });

        doneColumnId = doneColumn.id;
    });

    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.column.deleteMany();
        await prisma.board.deleteMany();

        await prisma.$disconnect();
    });

    // --------------------------------------------------
    // POST /api/tasks
    // --------------------------------------------------

    describe("POST /api/tasks", () => {
        it("should create a new task", async () => {
            const response = await request(app)
                .post("/api/tasks")
                .send({
                    title: "Complete TaskFlow",
                    description: "Build the TaskFlow assignment",
                    priority: Priority.HIGH,
                    columnId: todoColumnId,
                });

            expect(response.status).toBe(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();

            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.title).toBe(
                "Complete TaskFlow",
            );
            expect(response.body.data.description).toBe(
                "Build the TaskFlow assignment",
            );
            expect(response.body.data.priority).toBe(
                Priority.HIGH,
            );
            expect(response.body.data.columnId).toBe(
                todoColumnId,
            );

            taskId = response.body.data.id;
        });

        it("should create a task with MEDIUM priority by default", async () => {
            const response = await request(app)
                .post("/api/tasks")
                .send({
                    title: "Default Priority Task",
                    columnId: todoColumnId,
                });

            expect(response.status).toBe(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.priority).toBe(
                Priority.MEDIUM,
            );
        });

        it("should reject an empty task title", async () => {
            const response = await request(app)
                .post("/api/tasks")
                .send({
                    title: "",
                    columnId: todoColumnId,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should reject a non-existing column", async () => {
            const response = await request(app)
                .post("/api/tasks")
                .send({
                    title: "Invalid Column Task",
                    columnId: "non-existing-column",
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    // --------------------------------------------------
    // GET /api/tasks
    // --------------------------------------------------

    describe("GET /api/tasks", () => {
        it("should return all tasks", async () => {
            const response = await request(app)
                .get("/api/tasks");

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(
                true,
            );

            expect(response.body.data.length).toBeGreaterThan(
                0,
            );
        });

        it("should filter tasks by priority", async () => {
            const response = await request(app)
                .get(`/api/tasks?priority=${Priority.HIGH}`);

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(
                true,
            );

            for (const task of response.body.data) {
                expect(task.priority).toBe(Priority.HIGH);
            }
        });
    });

    // --------------------------------------------------
    // GET /api/tasks/:id
    // --------------------------------------------------

    describe("GET /api/tasks/:id", () => {
        it("should return a task by id", async () => {
            const response = await request(app)
                .get(`/api/tasks/${taskId}`);

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(taskId);
            expect(response.body.data.title).toBe(
                "Complete TaskFlow",
            );
        });

        it("should return 404 for a non-existing task", async () => {
            const response = await request(app)
                .get("/api/tasks/non-existing-task");

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    // --------------------------------------------------
    // GET /api/tasks/column/:columnId
    // --------------------------------------------------

    describe("GET /api/tasks/column/:columnId", () => {
        it("should return tasks for a column", async () => {
            const response = await request(app)
                .get(`/api/tasks/column/${todoColumnId}`);

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(
                true,
            );

            expect(
                response.body.data.some(
                    (task: { id: string }) =>
                        task.id === taskId,
                ),
            ).toBe(true);
        });

        it("should return 404 for a non-existing column", async () => {
            const response = await request(app)
                .get(
                    "/api/tasks/column/non-existing-column",
                );

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    // --------------------------------------------------
    // PATCH /api/tasks/:id
    // --------------------------------------------------

    describe("PATCH /api/tasks/:id", () => {
        it("should update a task", async () => {
            const response = await request(app)
                .patch(`/api/tasks/${taskId}`)
                .send({
                    title: "Updated TaskFlow Task",
                    description: "Updated description",
                    priority: Priority.LOW,
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(taskId);
            expect(response.body.data.title).toBe(
                "Updated TaskFlow Task",
            );
            expect(response.body.data.description).toBe(
                "Updated description",
            );
            expect(response.body.data.priority).toBe(
                Priority.LOW,
            );
        });

        it("should reject an empty task title", async () => {
            const response = await request(app)
                .patch(`/api/tasks/${taskId}`)
                .send({
                    title: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should return 404 for a non-existing task", async () => {
            const response = await request(app)
                .patch("/api/tasks/non-existing-task")
                .send({
                    title: "Updated Task",
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    // --------------------------------------------------
    // PATCH /api/tasks/:id/move
    // --------------------------------------------------

    describe("PATCH /api/tasks/:id/move", () => {
        it("should move a task to another column", async () => {
            const response = await request(app)
                .patch(`/api/tasks/${taskId}/move`)
                .send({
                    columnId: doneColumnId,
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(taskId);
            expect(response.body.data.columnId).toBe(
                doneColumnId,
            );
        });

        it("should reject a non-existing target column", async () => {
            const response = await request(app)
                .patch(`/api/tasks/${taskId}/move`)
                .send({
                    columnId: "non-existing-column",
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

        it("should return 404 for a non-existing task", async () => {
            const response = await request(app)
                .patch(
                    "/api/tasks/non-existing-task/move",
                )
                .send({
                    columnId: doneColumnId,
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    // --------------------------------------------------
    // DELETE /api/tasks/:id
    // --------------------------------------------------

    describe("DELETE /api/tasks/:id", () => {
        it("should delete a task", async () => {
            const response = await request(app)
                .delete(`/api/tasks/${taskId}`);

            expect(response.status).toBe(204);
        });

        it("should return 404 when deleting a non-existing task", async () => {
            const response = await request(app)
                .delete(`/api/tasks/${taskId}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });
});