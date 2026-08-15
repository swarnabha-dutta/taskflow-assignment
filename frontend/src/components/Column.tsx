import { useState } from "react";

import type {
    Column as ColumnType,
    Task,
} from "../types/taskflow";

import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

interface ColumnProps {
    column: ColumnType;
    columns: ColumnType[];
    tasks: Task[];
    onUpdated: () => void;
}

const Column = ({
    column,
    columns,
    tasks,
    onUpdated,
}: ColumnProps) => {
    const [showForm, setShowForm] =
        useState(false);

    return (
        <div className="column">
            <div className="column-header">
                <h2>{column.name}</h2>

                <span>{tasks.length}</span>
            </div>

            {showForm ? (
                <TaskForm
                    columnId={column.id}
                    onSuccess={() => {
                        setShowForm(false);
                        onUpdated();
                    }}
                    onCancel={() =>
                        setShowForm(false)
                    }
                />
            ) : (
                <button
                    type="button"
                    className="add-task-button"
                    onClick={() =>
                        setShowForm(true)
                    }
                >
                    + Add Task
                </button>
            )}

            <div className="tasks">
                {tasks.length === 0 ? (
                    <p className="empty-column">
                        No tasks
                    </p>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            columns={columns}
                            onUpdated={onUpdated}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Column;