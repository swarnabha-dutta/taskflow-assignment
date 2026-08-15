import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import App from "./App";

vi.mock("./api/taskflowApi", () => ({
    getBoards: vi.fn().mockResolvedValue([
        {
            id: "board-1",
            name: "TaskFlow Board",
            createdAt:
                "2026-08-14T00:00:00.000Z",
            updatedAt:
                "2026-08-14T00:00:00.000Z",
        },
    ]),

    getColumnsByBoardId: vi
        .fn()
        .mockResolvedValue([
            {
                id: "column-1",
                name: "To Do",
                position: 0,
                boardId: "board-1",
                createdAt:
                    "2026-08-14T00:00:00.000Z",
                updatedAt:
                    "2026-08-14T00:00:00.000Z",
            },
            {
                id: "column-2",
                name: "In Progress",
                position: 1,
                boardId: "board-1",
                createdAt:
                    "2026-08-14T00:00:00.000Z",
                updatedAt:
                    "2026-08-14T00:00:00.000Z",
            },
            {
                id: "column-3",
                name: "Done",
                position: 2,
                boardId: "board-1",
                createdAt:
                    "2026-08-14T00:00:00.000Z",
                updatedAt:
                    "2026-08-14T00:00:00.000Z",
            },
        ]),

    getTasksByColumn: vi
        .fn()
        .mockImplementation(
            async (columnId: string) => {
                if (columnId === "column-1") {
                    return [
                        {
                            id: "task-1",
                            title: "Test Task",
                            description:
                                "Testing TaskFlow frontend",
                            priority: "HIGH",
                            columnId: "column-1",
                            createdAt:
                                "2026-08-14T00:00:00.000Z",
                            updatedAt:
                                "2026-08-14T00:00:00.000Z",
                        },
                    ];
                }

                return [];
            },
        ),
}));

describe("App", () => {
    it("renders TaskFlow application", async () => {
        render(<App />);

        expect(
            screen.getByText(/Loading board/i),
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByText(
                    /TaskFlow Board/i,
                ),
            ).toBeInTheDocument();
        });

        expect(
            screen.getByRole("heading", {
                name: "To Do",
                level: 2,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "In Progress",
                level: 2,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Done",
                level: 2,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Test Task/i),
        ).toBeInTheDocument();

        expect(
            screen.getByText(/HIGH/i),
        ).toBeInTheDocument();
    });
});