import type { Request, Response } from "express";
import { Priority } from "../generated/prisma/client.js";
import { taskService } from "../services/task.service.js";
import {
    createTaskSchema,
    moveTaskSchema,
    updateTaskSchema,
} from "../validators/task.validator.js";
import { z } from "zod";

export const getTasks = async (
    req: Request,
    res: Response,
) => {
    const priority = req.query.priority;

    if (priority !== undefined) {
        const result = z
            .enum(Priority)
            .safeParse(priority);

        if (!result.success) {
            throw new z.ZodError(result.error.issues);
        }

        const tasks = await taskService.getTasksByPriority(
            result.data,
        );

        res.status(200).json({
            success: true,
            data: tasks,
        });

        return;
    }

    const tasks = await taskService.getAllTasks();

    res.status(200).json({
        success: true,
        data: tasks,
    });
};

export const getTaskById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const task = await taskService.getTaskById(
        req.params.id,
    );

    res.status(200).json({
        success: true,
        data: task,
    });
};

export const getTasksByColumn = async (
    req: Request<{ columnId: string }>,
    res: Response,
) => {
    const tasks = await taskService.getTasksByColumn(
        req.params.columnId,
    );

    res.status(200).json({
        success: true,
        data: tasks,
    });
};

export const createTask = async (
    req: Request,
    res: Response,
) => {
    const validatedData = createTaskSchema.parse(
        req.body,
    );

    const task = await taskService.createTask(
        validatedData,
    );

    res.status(201).json({
        success: true,
        data: task,
    });
};

export const updateTask = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const validatedData = updateTaskSchema.parse(
        req.body,
    );

    const task = await taskService.updateTask(
        req.params.id,
        validatedData,
    );

    res.status(200).json({
        success: true,
        data: task,
    });
};

export const moveTask = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const validatedData = moveTaskSchema.parse(
        req.body,
    );

    const task = await taskService.moveTask(
        req.params.id,
        validatedData.columnId,
    );

    res.status(200).json({
        success: true,
        data: task,
    });
};

export const deleteTask = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    await taskService.deleteTask(req.params.id);

    res.status(204).send();
};