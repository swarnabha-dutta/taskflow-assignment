import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import TaskForm from "./TaskForm";

import {
    createTask,
    updateTask,
} from "../api/taskflowApi";

import type { Task } from "../types/taskflow";

vi.mock("../api/taskflowApi", () => ({
    createTask: vi.fn(),
    updateTask: vi.fn(),
}));

describe("TaskForm", () => {
    const onSuccess = vi.fn();
    const onCancel = vi.fn();

    const task: Task = {
        id: "task-1",
        title: "Existing task",
        description: "Existing description",
        priority: "HIGH",
        columnId: "column-1",
        createdAt: "2026-08-14T00:00:00.000Z",
        updatedAt: "2026-08-14T00:00:00.000Z",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(createTask).mockResolvedValue(
            {} as Task,
        );

        vi.mocked(updateTask).mockResolvedValue(
            {} as Task,
        );
    });

    it("renders create form with default values", () => {
        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
            />,
        );

        expect(
            screen.getByPlaceholderText("Task title"),
        ).toHaveValue("");

        expect(
            screen.getByPlaceholderText("Description"),
        ).toHaveValue("");

        expect(
            screen.getByRole("combobox"),
        ).toHaveValue("MEDIUM");

        expect(
            screen.getByRole("button", {
                name: "Create Task",
            }),
        ).toBeInTheDocument();
    });

    it("renders edit form with existing task values", () => {
        render(
            <TaskForm
                columnId="column-1"
                task={task}
                onSuccess={onSuccess}
            />,
        );

        expect(
            screen.getByPlaceholderText("Task title"),
        ).toHaveValue("Existing task");

        expect(
            screen.getByPlaceholderText("Description"),
        ).toHaveValue("Existing description");

        expect(
            screen.getByRole("combobox"),
        ).toHaveValue("HIGH");

        expect(
            screen.getByRole("button", {
                name: "Update Task",
            }),
        ).toBeInTheDocument();
    });

    it("shows validation error when title is empty", async () => {
        const user = userEvent.setup();

        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Create Task",
            }),
        );

        expect(
            screen.getByText(
                "Task title is required.",
            ),
        ).toBeInTheDocument();

        expect(createTask).not.toHaveBeenCalled();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("creates a task successfully", async () => {
        const user = userEvent.setup();

        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
            />,
        );

        await user.type(
            screen.getByPlaceholderText("Task title"),
            "  New Task  ",
        );

        await user.type(
            screen.getByPlaceholderText("Description"),
            "  Task description  ",
        );

        await user.selectOptions(
            screen.getByRole("combobox"),
            "HIGH",
        );

        await user.click(
            screen.getByRole("button", {
                name: "Create Task",
            }),
        );

        expect(createTask).toHaveBeenCalledWith({
            title: "New Task",
            description: "Task description",
            priority: "HIGH",
            columnId: "column-1",
        });

        expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it("updates an existing task successfully", async () => {
        const user = userEvent.setup();

        render(
            <TaskForm
                columnId="column-1"
                task={task}
                onSuccess={onSuccess}
            />,
        );

        const titleInput =
            screen.getByPlaceholderText(
                "Task title",
            );

        await user.clear(titleInput);

        await user.type(
            titleInput,
            "Updated task",
        );

        await user.click(
            screen.getByRole("button", {
                name: "Update Task",
            }),
        );

        expect(updateTask).toHaveBeenCalledWith(
            "task-1",
            {
                title: "Updated task",
                description: "Existing description",
                priority: "HIGH",
            },
        );

        expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it("changes priority correctly", async () => {
        const user = userEvent.setup();

        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
            />,
        );

        await user.selectOptions(
            screen.getByRole("combobox"),
            "LOW",
        );

        expect(
            screen.getByRole("combobox"),
        ).toHaveValue("LOW");
    });

    it("calls onCancel when Cancel is clicked", async () => {
        const user = userEvent.setup();

        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
                onCancel={onCancel}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Cancel",
            }),
        );

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("does not render Cancel when onCancel is not provided", () => {
        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
            />,
        );

        expect(
            screen.queryByRole("button", {
                name: "Cancel",
            }),
        ).not.toBeInTheDocument();
    });

    it("shows create error when API request fails", async () => {
        const user = userEvent.setup();

        vi.mocked(createTask).mockRejectedValue(
            new Error("API error"),
        );

        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
            />,
        );

        await user.type(
            screen.getByPlaceholderText("Task title"),
            "New task",
        );

        await user.click(
            screen.getByRole("button", {
                name: "Create Task",
            }),
        );

        expect(
            await screen.findByText(
                "Failed to create task.",
            ),
        ).toBeInTheDocument();

        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("shows update error when API request fails", async () => {
        const user = userEvent.setup();

        vi.mocked(updateTask).mockRejectedValue(
            new Error("API error"),
        );

        render(
            <TaskForm
                columnId="column-1"
                task={task}
                onSuccess={onSuccess}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Update Task",
            }),
        );

        expect(
            await screen.findByText(
                "Failed to update task.",
            ),
        ).toBeInTheDocument();

        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("shows saving state while create request is pending", async () => {
        const user = userEvent.setup();

        let resolveCreate:
            | ((value: Task) => void)
            | undefined;

        vi.mocked(createTask).mockImplementation(
            () =>
                new Promise<Task>((resolve) => {
                    resolveCreate = resolve;
                }),
        );

        render(
            <TaskForm
                columnId="column-1"
                onSuccess={onSuccess}
            />,
        );

        await user.type(
            screen.getByPlaceholderText("Task title"),
            "New task",
        );

        await user.click(
            screen.getByRole("button", {
                name: "Create Task",
            }),
        );

        expect(
            screen.getByRole("button", {
                name: "Saving...",
            }),
        ).toBeDisabled();

        expect(
            screen.getByPlaceholderText("Task title"),
        ).toBeDisabled();

        expect(
            screen.getByPlaceholderText("Description"),
        ).toBeDisabled();

        expect(
            screen.getByRole("combobox"),
        ).toBeDisabled();

        resolveCreate?.({} as Task);
    });
});