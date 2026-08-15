import { useState } from "react";

import {
    deleteTask,
    moveTask,
} from "../api/taskflowApi";

import type {
    Column as ColumnType,
    Task,
} from "../types/taskflow";

import TaskForm from "./TaskForm";

interface TaskCardProps {
    task: Task;
    columns: ColumnType[];
    onUpdated: () => void;
}

const TaskCard = ({
    task,
    columns,
    onUpdated,
}: TaskCardProps) => {
    const [editing, setEditing] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [moving, setMoving] =
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

    const handleMove = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const newColumnId =
            event.target.value;

        if (!newColumnId) {
            return;
        }

        if (newColumnId === task.columnId) {
            return;
        }

        try {
            setMoving(true);

            await moveTask(
                task.id,
                newColumnId,
            );

            onUpdated();
        } catch (error) {
            console.error(error);

            window.alert(
                "Failed to move task.",
            );
        } finally {
            setMoving(false);
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

                <select
                    value=""
                    onChange={handleMove}
                    disabled={moving}
                    aria-label={`Move ${task.title}`}
                >
                    <option value="">
                        {moving
                            ? "Moving..."
                            : "Move to..."}
                    </option>

                    {columns.map(
                        (column) => (
                            <option
                                key={column.id}
                                value={column.id}
                                disabled={
                                    column.id ===
                                    task.columnId
                                }
                            >
                                {column.name}
                            </option>
                        ),
                    )}
                </select>
            </div>
        </div>
    );
};

export default TaskCard;