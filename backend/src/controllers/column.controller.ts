import type { Request, Response } from "express";
import { columnService } from "../services/column.service.js";

export const getColumnsByBoardId = async (
    req: Request<{ boardId: string }>,
    res: Response,
) => {
    const columns = await columnService.getColumnsByBoardId(
        req.params.boardId,
    );

    res.status(200).json({
        success: true,
        data: columns,
    });
};

export const getColumnById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const column = await columnService.getColumnById(
        req.params.id,
    );

    res.status(200).json({
        success: true,
        data: column,
    });
};

export const createColumn = async (
    req: Request<{ boardId: string }>,
    res: Response,
) => {
    const column = await columnService.createColumn(
        req.params.boardId,
        req.body.name,
        req.body.position,
    );

    res.status(201).json({
        success: true,
        data: column,
    });
};

export const updateColumn = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const column = await columnService.updateColumn(
        req.params.id,
        req.body,
    );

    res.status(200).json({
        success: true,
        data: column,
    });
};

export const deleteColumn = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    await columnService.deleteColumn(req.params.id);

    res.status(204).send();
};