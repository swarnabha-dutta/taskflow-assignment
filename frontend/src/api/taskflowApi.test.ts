import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    mockGet,
    mockPost,
    mockPatch,
    mockDelete,
} = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockPatch: vi.fn(),
    mockDelete: vi.fn(),
}));

vi.mock("axios", () => ({
    default: {
        create: vi.fn(() => ({
            get: mockGet,
            post: mockPost,
            patch: mockPatch,
            delete: mockDelete,
        })),
    },
}));

import {
    getBoards,
    getColumnsByBoardId,
    getTasksByColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
} from "./taskflowApi";

describe("taskflowApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getBoards", () => {
        it("fetches all boards", async () => {
            const boards = [
                {
                    id: "board-1",
                    name: "TaskFlow Board",
                },
            ];

            mockGet.mockResolvedValue({
                data: {
                    success: true,
                    data: boards,
                },
            });

            const result = await getBoards();

            expect(mockGet).toHaveBeenCalledWith(
                "/boards",
            );

            expect(result).toEqual(boards);
        });
    });

    describe("getColumnsByBoardId", () => {
        it("fetches columns for a board", async () => {
            const columns = [
                {
                    id: "column-1",
                    name: "Todo",
                    boardId: "board-1",
                },
                {
                    id: "column-2",
                    name: "Done",
                    boardId: "board-1",
                },
            ];

            mockGet.mockResolvedValue({
                data: {
                    success: true,
                    data: columns,
                },
            });

            const result =
                await getColumnsByBoardId(
                    "board-1",
                );

            expect(mockGet).toHaveBeenCalledWith(
                "/columns/board/board-1",
            );

            expect(result).toEqual(columns);
        });
    });

    describe("getTasksByColumn", () => {
        it("fetches tasks for a column", async () => {
            const tasks = [
                {
                    id: "task-1",
                    title: "First task",
                    description: "Test task",
                    priority: "HIGH",
                    columnId: "column-1",
                },
            ];

            mockGet.mockResolvedValue({
                data: {
                    success: true,
                    data: tasks,
                },
            });

            const result =
                await getTasksByColumn(
                    "column-1",
                );

            expect(mockGet).toHaveBeenCalledWith(
                "/tasks/column/column-1",
            );

            expect(result).toEqual(tasks);
        });
    });

    describe("createTask", () => {
        it("creates a task with the correct payload", async () => {
            const payload = {
                title: "New task",
                description: "Task description",
                priority: "HIGH" as const,
                columnId: "column-1",
            };

            const createdTask = {
                id: "task-1",
                ...payload,
            };

            mockPost.mockResolvedValue({
                data: {
                    success: true,
                    data: createdTask,
                },
            });

            const result =
                await createTask(payload);

            expect(mockPost).toHaveBeenCalledWith(
                "/tasks",
                payload,
            );

            expect(result).toEqual(
                createdTask,
            );
        });
    });

    describe("updateTask", () => {
        it("updates a task with the correct payload", async () => {
            const taskId = "task-1";

            const payload = {
                title: "Updated task",
                description: "Updated description",
                priority: "MEDIUM" as const,
            };

            const updatedTask = {
                id: taskId,
                title: "Updated task",
                description: "Updated description",
                priority: "MEDIUM" as const,
                columnId: "column-1",
            };

            mockPatch.mockResolvedValue({
                data: {
                    success: true,
                    data: updatedTask,
                },
            });

            const result =
                await updateTask(
                    taskId,
                    payload,
                );

            expect(mockPatch).toHaveBeenCalledWith(
                `/tasks/${taskId}`,
                payload,
            );

            expect(result).toEqual(
                updatedTask,
            );
        });
    });

    describe("deleteTask", () => {
        it("deletes a task", async () => {
            mockDelete.mockResolvedValue({
                status: 204,
            });

            await deleteTask("task-1");

            expect(mockDelete).toHaveBeenCalledWith(
                "/tasks/task-1",
            );
        });
    });

    describe("moveTask", () => {
        it("moves a task to another column", async () => {
            const taskId = "task-1";
            const columnId = "column-2";

            const movedTask = {
                id: taskId,
                title: "Moved task",
                description: "",
                priority: "HIGH" as const,
                columnId,
            };

            mockPatch.mockResolvedValue({
                data: {
                    success: true,
                    data: movedTask,
                },
            });

            const result =
                await moveTask(
                    taskId,
                    columnId,
                );

            expect(mockPatch).toHaveBeenCalledWith(
                `/tasks/${taskId}/move`,
                {
                    columnId,
                },
            );

            expect(result).toEqual(
                movedTask,
            );
        });
    });
});