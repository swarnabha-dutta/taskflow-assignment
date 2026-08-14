import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TaskCard from "./TaskCard";

import { deleteTask } from "../api/taskflowApi";

import type { Task } from "../types/taskflow";

vi.mock("../api/taskflowApi", () => ({
    deleteTask: vi.fn(),
}));

vi.mock("./TaskForm", () => ({
    default: ({
        columnId,
        task,
        onSuccess,
        onCancel,
    }: {
        columnId: string;
        task?: Task;
        onSuccess: () => void;
        onCancel: () => void;
    }) => (
        <div data-testid="task-form">
            <div>Task Form</div>
            <div>Column: {columnId}</div>

            {task && (
                <div>Editing: {task.title}</div>
            )}

            <button
                type="button"
                onClick={onSuccess}
            >
                Save Task
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

describe("TaskCard", () => {
    const task: Task = {
        id: "task-1",
        title: "Build frontend",
        description: "Build the TaskFlow frontend",
        priority: "HIGH",
        columnId: "column-1",
        createdAt: "2026-08-14T00:00:00.000Z",
        updatedAt: "2026-08-14T00:00:00.000Z",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(window, "confirm").mockReturnValue(true);
        vi.spyOn(window, "alert").mockImplementation(() => { });
    });

    it("renders task information", () => {
        render(
            <TaskCard
                task={task}
                onUpdated={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "Build frontend",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Build the TaskFlow frontend"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("HIGH"),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Edit",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Delete",
            }),
        ).toBeInTheDocument();
    });

    it("does not render description when description is empty", () => {
        const taskWithoutDescription: Task = {
            ...task,
            description: "",
        };

        render(
            <TaskCard
                task={taskWithoutDescription}
                onUpdated={vi.fn()}
            />,
        );

        expect(
            screen.queryByText(
                "Build the TaskFlow frontend",
            ),
        ).not.toBeInTheDocument();
    });

    it("opens edit form when Edit is clicked", async () => {
        const user = userEvent.setup();

        render(
            <TaskCard
                task={task}
                onUpdated={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Edit",
            }),
        );

        expect(
            screen.getByTestId("task-form"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Editing: Build frontend"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Column: column-1"),
        ).toBeInTheDocument();
    });

    it("closes edit form when Cancel is clicked", async () => {
        const user = userEvent.setup();

        render(
            <TaskCard
                task={task}
                onUpdated={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Edit",
            }),
        );

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
                name: "Edit",
            }),
        ).toBeInTheDocument();
    });

    it("calls onUpdated after successful edit", async () => {
        const user = userEvent.setup();
        const onUpdated = vi.fn();

        render(
            <TaskCard
                task={task}
                onUpdated={onUpdated}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Edit",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Save Task",
            }),
        );

        expect(onUpdated).toHaveBeenCalledTimes(1);
    });

    it("deletes task after confirmation", async () => {
        const user = userEvent.setup();
        const onUpdated = vi.fn();

        vi.mocked(deleteTask).mockResolvedValue(undefined);

        render(
            <TaskCard
                task={task}
                onUpdated={onUpdated}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Delete",
            }),
        );

        expect(window.confirm).toHaveBeenCalledWith(
            'Delete "Build frontend"?',
        );

        expect(deleteTask).toHaveBeenCalledWith(
            "task-1",
        );

        expect(onUpdated).toHaveBeenCalledTimes(1);
    });

    it("does not delete task when confirmation is cancelled", async () => {
        const user = userEvent.setup();

        vi.mocked(window.confirm).mockReturnValue(false);

        render(
            <TaskCard
                task={task}
                onUpdated={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Delete",
            }),
        );

        expect(deleteTask).not.toHaveBeenCalled();
    });

    it("shows deleting state while delete request is pending", async () => {
        const user = userEvent.setup();

        let resolveDelete:
            | (() => void)
            | undefined;

        vi.mocked(deleteTask).mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveDelete = resolve;
                }),
        );

        render(
            <TaskCard
                task={task}
                onUpdated={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Delete",
            }),
        );

        expect(
            screen.getByRole("button", {
                name: "Deleting...",
            }),
        ).toBeDisabled();

        resolveDelete?.();
    });

    it("shows alert when delete fails", async () => {
        const user = userEvent.setup();

        const error = new Error("Delete failed");

        vi.mocked(deleteTask).mockRejectedValue(error);

        render(
            <TaskCard
                task={task}
                onUpdated={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Delete",
            }),
        );

        expect(window.alert).toHaveBeenCalledWith(
            "Failed to delete task.",
        );
    });
});