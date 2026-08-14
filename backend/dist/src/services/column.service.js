import { columnRepository } from "../respositories/column.repository.js";
import { boardRepository } from "../respositories/board.repository.js";
export const columnService = {
    async getColumnsByBoardId(boardId) {
        await boardRepository.findById(boardId);
        return columnRepository.findByBoardId(boardId);
    },
    async getColumnById(id) {
        const column = await columnRepository.findById(id);
        if (!column) {
            throw new Error("Column not found");
        }
        return column;
    },
    async createColumn(boardId, name, position) {
        const board = await boardRepository.findById(boardId);
        if (!board) {
            throw new Error("Board not found");
        }
        const trimmedName = name.trim();
        if (!trimmedName) {
            throw new Error("Column name is required");
        }
        if (!Number.isInteger(position) || position < 0) {
            throw new Error("Column position must be a non-negative integer");
        }
        return columnRepository.create(boardId, trimmedName, position);
    },
    async updateColumn(id, data) {
        await this.getColumnById(id);
        if (data.name !== undefined) {
            data.name = data.name.trim();
            if (!data.name) {
                throw new Error("Column name cannot be empty");
            }
        }
        if (data.position !== undefined &&
            (!Number.isInteger(data.position) || data.position < 0)) {
            throw new Error("Column position must be a non-negative integer");
        }
        return columnRepository.update(id, data);
    },
    async deleteColumn(id) {
        await this.getColumnById(id);
        return columnRepository.delete(id);
    },
};
