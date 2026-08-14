import {
    render,
    screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import Column from "./Column";

import type {
    Column as ColumnType,
    Task,
} from "../types/taskflow";

vi.mock("./TaskCard", () => ({
    default: ({
        task,
    }: {
        task: Task;
        onUpdated: () => void;
    }) => (
        <div data-testid={`task-${task.id}`}>
            {task.title}
        </div>
    ),
}));

vi.mock("./TaskForm", () => ({
    default: ({
        columnId,
        onSuccess,
        onCancel,
    }: {
        columnId: string;
        onSuccess: () => void;
        onCancel: () => void;
    }) => (
        <div data-testid="task-form">
            <span>Task Form for {columnId}</span>

            <button
                type="button"
                onClick={onSuccess}
            >
                Submit Task
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
    ),
}));

describe("Column", () => {
    const column: ColumnType = {
        id: "column-1",
        name: "To Do",
        position: 0,
        boardId: "board-1",
        createdAt: "2026-08-14T00:00:00.000Z",
        updatedAt: "2026-08-14T00:00:00.000Z",
    };

    const tasks: Task[] = [
        {
            id: "task-1",
            title: "Build frontend",
            description: "Build TaskFlow frontend",
            priority: "HIGH",
            columnId: "column-1",
            createdAt:
                "2026-08-14T00:00:00.000Z",
            updatedAt:
                "2026-08-14T00:00:00.000Z",
        },
        {
            id: "task-2",
            title: "Write tests",
            description: "Write frontend tests",
            priority: "MEDIUM",
            columnId: "column-1",
            createdAt:
                "2026-08-14T00:00:00.000Z",
            updatedAt:
                "2026-08-14T00:00:00.000Z",
        },
    ];

    it("renders column name and task count", () => {
        render(
            <Column
                column={column}
                tasks={tasks}
                onUpdated={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "To Do",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText("2"),
        ).toBeInTheDocument();
    });

    it("shows empty state when there are no tasks", () => {
        render(
            <Column
                column={column}
                tasks={[]}
                onUpdated={vi.fn()}
            />,
        );

        expect(
            screen.getByText("No tasks"),
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("task-task-1"),
        ).not.toBeInTheDocument();
    });

    it("renders all tasks", () => {
        render(
            <Column
                column={column}
                tasks={tasks}
                onUpdated={vi.fn()}
            />,
        );

        expect(
            screen.getByText("Build frontend"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Write tests"),
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("task-task-1"),
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("task-task-2"),
        ).toBeInTheDocument();
    });

    it("opens task form when Add Task is clicked", async () => {
        const user = userEvent.setup();

        render(
            <Column
                column={column}
                tasks={[]}
                onUpdated={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "+ Add Task",
            }),
        );

        expect(
            screen.getByTestId("task-form"),
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Task Form for column-1",
            ),
        ).toBeInTheDocument();
    });

    it("closes task form when Cancel is clicked", async () => {
        const user = userEvent.setup();

        render(
            <Column
                column={column}
                tasks={[]}
                onUpdated={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "+ Add Task",
            }),
        );

        expect(
            screen.getByTestId("task-form"),
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Cancel",
            }),
        );

        expect(
            screen.queryByTestId("task-form"),
        ).not.toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "+ Add Task",
            }),
        ).toBeInTheDocument();
    });

    it("calls onUpdated after successful task creation", async () => {
        const user = userEvent.setup();
        const onUpdated = vi.fn();

        render(
            <Column
                column={column}
                tasks={[]}
                onUpdated={onUpdated}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "+ Add Task",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit Task",
            }),
        );

        expect(onUpdated).toHaveBeenCalledTimes(1);

        expect(
            screen.queryByTestId("task-form"),
        ).not.toBeInTheDocument();
    });
});