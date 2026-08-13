import { z } from "zod";

export const createColumnSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Column name is required"),

    position: z
        .number()
        .int()
        .min(0),
});

export const updateColumnSchema = z
    .object({
        name: z.string().trim().min(1).optional(),

        position: z
            .number()
            .int()
            .min(0)
            .optional(),
    })
    .refine(
        (data) => data.name !== undefined || data.position !== undefined,
        {
            message: "At least one field is required",
        },
    );