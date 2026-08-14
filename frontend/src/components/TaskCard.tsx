import { useState } from "react";

import { deleteTask } from "../api/taskflowApi";

import type { Task } from "../types/taskflow";

import TaskForm from "./TaskForm";

interface TaskCardProps {
    task: Task;
    onUpdated: () => void;
}

const TaskCard = ({
    task,
    onUpdated,
}: TaskCardProps) => {
    const [editing, setEditing] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Delete "${task.title}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await deleteTask(task.id);

            onUpdated();
        } catch (error) {
            console.error(error);

            window.alert(
                "Failed to delete task.",
            );
        } finally {
            setDeleting(false);
        }
    };

    if (editing) {
        return (
            <div className="task-card">
                <TaskForm
                    columnId={task.columnId}
                    task={task}
                    onSuccess={() => {
                        setEditing(false);
                        onUpdated();
                    }}
                    onCancel={() =>
                        setEditing(false)
                    }
                />
            </div>
        );
    }

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3>{task.title}</h3>

                <span
                    className={`priority ${task.priority.toLowerCase()}`}
                >
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p>{task.description}</p>
            )}

            <div className="task-actions">
                <button
                    type="button"
                    onClick={() =>
                        setEditing(true)
                    }
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting
                        ? "Deleting..."
                        : "Delete"}
                </button>
            </div>
        </div>
    );
};

export default TaskCard;