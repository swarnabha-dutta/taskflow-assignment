import { useCallback, useEffect, useState } from "react";

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

import Column from "./Column";

const Board = () => {
    const [board, setBoard] =
        useState<BoardType | null>(null);

    const [columns, setColumns] =
        useState<ColumnType[]>([]);

    const [tasks, setTasks] =
        useState<Record<string, Task[]>>({});

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadBoard = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const boards =
                    await getBoards();

                if (boards.length === 0) {
                    setBoard(null);
                    setColumns([]);
                    setTasks({});
                    return;
                }

                const currentBoard =
                    boards[0];

                setBoard(currentBoard);

                const boardColumns =
                    await getColumnsByBoardId(
                        currentBoard.id,
                    );

                setColumns(boardColumns);

                const taskResults =
                    await Promise.all(
                        boardColumns.map(
                            async (column) => {
                                const columnTasks =
                                    await getTasksByColumn(
                                        column.id,
                                    );

                                return {
                                    columnId:
                                        column.id,
                                    tasks:
                                        columnTasks,
                                };
                            },
                        ),
                    );

                const taskMap: Record<
                    string,
                    Task[]
                > = {};

                taskResults.forEach(
                    ({
                        columnId,
                        tasks,
                    }) => {
                        taskMap[columnId] =
                            tasks;
                    },
                );

                setTasks(taskMap);
            } catch (error) {
                console.error(error);

                setError(
                    "Failed to load board. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        loadBoard();
    }, [loadBoard]);

    if (loading) {
        return (
            <div className="status">
                Loading board...
            </div>
        );
    }

    if (error) {
        return (
            <div className="status error">
                {error}
            </div>
        );
    }

    if (!board) {
        return (
            <div className="status">
                No board available.
            </div>
        );
    }

    return (
        <main className="board-page">
            <header className="board-header">
                <h1>{board.name}</h1>
            </header>

            <section className="board">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={
                            tasks[column.id] ??
                            []
                        }
                        onUpdated={loadBoard}
                    />
                ))}
            </section>
        </main>
    );
};

export default Board;