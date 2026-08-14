import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import Board from "./Board";

import {
    getBoards,
    getColumnsByBoardId,
    getTasksByColumn,
} from "../api/taskflowApi";

import type {
    Board as BoardType,
    Column as ColumnType,
    Task,
} from "../types/taskflow";

vi.mock("../api/taskflowApi", () => ({
    getBoards: vi.fn(),
    getColumnsByBoardId: vi.fn(),
    getTasksByColumn: vi.fn(),
}));

vi.mock("./Column", () => ({
    default: ({
        column,
        tasks,
    }: {
        column: ColumnType;
        tasks: Task[];
    }) => (
        <div data-testid={`column-${column.id}`}>
            <h2>{column.name}</h2>

            {tasks.map((task) => (
                <div key={task.id}>
                    {task.title}
                </div>
            ))}
        </div>
    ),
}));

describe("Board", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state initially", () => {
        vi.mocked(getBoards).mockReturnValue(
            new Promise(() => { }),
        );

        render(<Board />);

        expect(
            screen.getByText("Loading board..."),
        ).toBeInTheDocument();
    });

    it("renders board with columns and tasks", async () => {
        const board: BoardType = {
            id: "board-1",
            name: "TaskFlow Board",
            createdAt: "2026-08-14T00:00:00.000Z",
            updatedAt: "2026-08-14T00:00:00.000Z",
        };

        const columns: ColumnType[] = [
            {
                id: "column-1",
                name: "To Do",
                position: 0,
                boardId: "board-1",
                createdAt: "2026-08-14T00:00:00.000Z",
                updatedAt: "2026-08-14T00:00:00.000Z",
            },
            {
                id: "column-2",
                name: "In Progress",
                position: 1,
                boardId: "board-1",
                createdAt: "2026-08-14T00:00:00.000Z",
                updatedAt: "2026-08-14T00:00:00.000Z",
            },
        ];

        const tasks: Task[] = [
            {
                id: "task-1",
                title: "Build frontend",
                description: "Build TaskFlow frontend",
                priority: "HIGH",
                columnId: "column-1",
                createdAt: "2026-08-14T00:00:00.000Z",
                updatedAt: "2026-08-14T00:00:00.000Z",
            },
        ];

        vi.mocked(getBoards).mockResolvedValue([board]);

        vi.mocked(getColumnsByBoardId).mockResolvedValue(
            columns,
        );

        vi.mocked(getTasksByColumn).mockImplementation(
            async (columnId) => {
                if (columnId === "column-1") {
                    return tasks;
                }

                return [];
            },
        );

        render(<Board />);

        await waitFor(() => {
            expect(
                screen.getByRole("heading", {
                    name: "TaskFlow Board",
                }),
            ).toBeInTheDocument();
        });

        expect(
            screen.getByText("To Do"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("In Progress"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Build frontend"),
        ).toBeInTheDocument();

        expect(getBoards).toHaveBeenCalledTimes(1);

        expect(
            getColumnsByBoardId,
        ).toHaveBeenCalledWith("board-1");

        expect(
            getTasksByColumn,
        ).toHaveBeenCalledWith("column-1");

        expect(
            getTasksByColumn,
        ).toHaveBeenCalledWith("column-2");
    });

    it("shows empty state when no board exists", async () => {
        vi.mocked(getBoards).mockResolvedValue([]);

        render(<Board />);

        await waitFor(() => {
            expect(
                screen.getByText("No board available."),
            ).toBeInTheDocument();
        });

        expect(
            getColumnsByBoardId,
        ).not.toHaveBeenCalled();

        expect(
            getTasksByColumn,
        ).not.toHaveBeenCalled();
    });

    it("shows error state when loading fails", async () => {
        vi.mocked(getBoards).mockRejectedValue(
            new Error("API error"),
        );

        render(<Board />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Failed to load board. Please try again.",
                ),
            ).toBeInTheDocument();
        });
    });
});