import { boardService } from "../services/board.service.js";
export const getBoards = async (_req, res) => {
    const boards = await boardService.getAllBoards();
    res.status(200).json({
        success: true,
        data: boards,
    });
};
export const getBoardById = async (req, res) => {
    const board = await boardService.getBoardById(req.params.id);
    res.status(200).json({
        success: true,
        data: board,
    });
};
export const createBoard = async (req, res) => {
    const board = await boardService.createBoard(req.body.name);
    res.status(201).json({
        success: true,
        data: board,
    });
};
export const updateBoard = async (req, res) => {
    const board = await boardService.updateBoard(req.params.id, req.body.name);
    res.status(200).json({
        success: true,
        data: board,
    });
};
export const deleteBoard = async (req, res) => {
    await boardService.deleteBoard(req.params.id);
    res.status(204).send();
};
