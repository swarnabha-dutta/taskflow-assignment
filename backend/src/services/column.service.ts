import { columnRepository } from "../respositories/column.repository.js";
import { boardRepository } from "../respositories/board.repository.js";
import { AppError } from "../utils/AppError.js";

export const columnService = {
    async getColumnsByBoardId(boardId: string) {
        const board = await boardRepository.findById(boardId);

        if (!board) {
            throw new AppError("Board not found", 404);
        }

        return columnRepository.findByBoardId(boardId);
    },

    async getColumnById(id: string) {
        const column = await columnRepository.findById(id);

        if (!column) {
            throw new AppError("Column not found", 404);
        }

        return column;
    },

    async createColumn(
        boardId: string,
        name: string,
        position: number,
    ) {
        const board = await boardRepository.findById(boardId);

        if (!board) {
            throw new AppError("Board not found", 404);
        }

        const trimmedName = name.trim();

        if (!trimmedName) {
            throw new AppError("Column name is required", 400);
        }

        if (!Number.isInteger(position) || position < 0) {
            throw new AppError(
                "Column position must be a non-negative integer",
                400,
            );
        }

        return columnRepository.create(
            boardId,
            trimmedName,
            position,
        );
    },

    async updateColumn(
        id: string,
        data: {
            name?: string;
            position?: number;
        },
    ) {
        await this.getColumnById(id);

        if (data.name !== undefined) {
            data.name = data.name.trim();

            if (!data.name) {
                throw new AppError(
                    "Column name cannot be empty",
                    400,
                );
            }
        }

        if (
            data.position !== undefined &&
            (!Number.isInteger(data.position) || data.position < 0)
        ) {
            throw new AppError(
                "Column position must be a non-negative integer",
                400,
            );
        }

        return columnRepository.update(id, data);
    },

    async deleteColumn(id: string) {
        await this.getColumnById(id);

        return columnRepository.delete(id);
    },
};