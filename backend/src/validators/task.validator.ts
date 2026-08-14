import { z } from "zod";
import { Priority } from "../generated/prisma/client.js";

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Task title is required"),

    description: z
        .string()
        .trim()
        .optional(),

    priority: z
        .enum(Priority)
        .default(Priority.MEDIUM),

    columnId: z
        .string()
        .trim()
        .min(1, "Column ID is required"),
});

export const updateTaskSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1)
            .optional(),

        description: z
            .string()
            .trim()
            .optional(),

        priority: z
            .enum(Priority)
            .optional(),
    })
    .refine(
        (data) =>
            data.title !== undefined ||
            data.description !== undefined ||
            data.priority !== undefined,
        {
            message: "At least one field is required",
        },
    );

export const moveTaskSchema = z.object({
    columnId: z
        .string()
        .trim()
        .min(1, "Target column ID is required"),
});