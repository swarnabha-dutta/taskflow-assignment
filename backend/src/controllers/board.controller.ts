import type { Request, Response } from "express";
import { boardService } from "../services/board.service.js";

export const getBoards = async (_req: Request, res: Response) => {
    const boards = await boardService.getAllBoards();

    res.status(200).json({
        success: true,
        data: boards,
    });
};

export const getBoardById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const board = await boardService.getBoardById(req.params.id);

    res.status(200).json({
        success: true,
        data: board,
    });
};

export const createBoard = async (
    req: Request,
    res: Response,
) => {
    const board = await boardService.createBoard(req.body.name);

    res.status(201).json({
        success: true,
        data: board,
    });
};

export const updateBoard = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const board = await boardService.updateBoard(
        req.params.id,
        req.body.name,
    );

    res.status(200).json({
        success: true,
        data: board,
    });
};

export const deleteBoard = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    await boardService.deleteBoard(req.params.id);

    res.status(204).send();
};