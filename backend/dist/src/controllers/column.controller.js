import { columnService } from "../services/column.service.js";
export const getColumnsByBoardId = async (req, res) => {
    const columns = await columnService.getColumnsByBoardId(req.params.boardId);
    res.status(200).json({
        success: true,
        data: columns,
    });
};
export const getColumnById = async (req, res) => {
    const column = await columnService.getColumnById(req.params.id);
    res.status(200).json({
        success: true,
        data: column,
    });
};
export const createColumn = async (req, res) => {
    const column = await columnService.createColumn(req.params.boardId, req.body.name, req.body.position);
    res.status(201).json({
        success: true,
        data: column,
    });
};
export const updateColumn = async (req, res) => {
    const column = await columnService.updateColumn(req.params.id, req.body);
    res.status(200).json({
        success: true,
        data: column,
    });
};
export const deleteColumn = async (req, res) => {
    await columnService.deleteColumn(req.params.id);
    res.status(204).send();
};
