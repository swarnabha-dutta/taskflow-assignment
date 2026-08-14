export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Board {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Column {
    id: string;
    name: string;
    position: number;
    boardId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    priority: Priority;
    columnId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}