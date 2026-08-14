import { useState } from "react";

import {
    createTask,
    updateTask,
} from "../api/taskflowApi";

import type {
    Priority,
    Task,
} from "../types/taskflow";

interface TaskFormProps {
    columnId: string;
    task?: Task;
    onSuccess: () => void;
    onCancel?: () => void;
}

const TaskForm = ({
    columnId,
    task,
    onSuccess,
    onCancel,
}: TaskFormProps) => {
    const isEditing = Boolean(task);

    const [title, setTitle] = useState(
        task?.title ?? "",
    );

    const [description, setDescription] = useState(
        task?.description ?? "",
    );

    const [priority, setPriority] =
        useState<Priority>(
            task?.priority ?? "MEDIUM",
        );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: React.FormEvent,
    ) => {
        event.preventDefault();

        if (!title.trim()) {
            setError("Task title is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            if (isEditing && task) {
                await updateTask(task.id, {
                    title: title.trim(),
                    description:
                        description.trim(),
                    priority,
                });
            } else {
                await createTask({
                    title: title.trim(),
                    description:
                        description.trim(),
                    priority,
                    columnId,
                });
            }

            onSuccess();
        } catch (error) {
            console.error(error);

            setError(
                isEditing
                    ? "Failed to update task."
                    : "Failed to create task.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="task-form"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(event) =>
                    setTitle(event.target.value)
                }
                disabled={loading}
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(event) =>
                    setDescription(event.target.value)
                }
                disabled={loading}
                rows={3}
            />

            <select
                value={priority}
                onChange={(event) =>
                    setPriority(
                        event.target.value as Priority,
                    )
                }
                disabled={loading}
            >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
            </select>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <div className="form-actions">
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : isEditing
                            ? "Update Task"
                            : "Create Task"}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;