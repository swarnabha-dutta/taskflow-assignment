import axios from "axios";

import type {
    ApiResponse,
    Board,
    Column,
    Task,
} from "../types/taskflow";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const getBoards = async (): Promise<Board[]> => {
    const response = await api.get<ApiResponse<Board[]>>(
        "/boards",
    );

    return response.data.data;
};

export const getColumnsByBoardId = async (
    boardId: string,
): Promise<Column[]> => {
    const response = await api.get<ApiResponse<Column[]>>(
        `/columns/board/${boardId}`,
    );

    return response.data.data;
};

export const getTasksByColumn = async (
    columnId: string,
): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>(
        `/tasks/column/${columnId}`,
    );

    return response.data.data;
};

/* ---------------- TASK API ---------------- */

export interface CreateTaskPayload {
    title: string;
    description?: string;
    priority: Task["priority"];
    columnId: string;
}

export interface UpdateTaskPayload {
    title?: string;
    description?: string;
    priority?: Task["priority"];
}

export const createTask = async (
    payload: CreateTaskPayload,
): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(
        "/tasks",
        payload,
    );

    return response.data.data;
};

export const updateTask = async (
    taskId: string,
    payload: UpdateTaskPayload,
): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(
        `/tasks/${taskId}`,
        payload,
    );

    return response.data.data;
};

export const deleteTask = async (
    taskId: string,
): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
};

export const moveTask = async (
    taskId: string,
    columnId: string,
): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(
        `/tasks/${taskId}/move`,
        {
            columnId,
        },
    );

    return response.data.data;
};