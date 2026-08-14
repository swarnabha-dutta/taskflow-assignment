import { boardRepository } from "../respositories/board.repository.js";
import { AppError } from "../utils/AppError.js";
export const boardService = {
    async getAllBoards() {
        return boardRepository.findAll();
    },
    async getBoardById(id) {
        const board = await boardRepository.findById(id);
        if (!board) {
            throw new AppError("Task not found", 404);
        }
        return board;
    },
    async createBoard(name) {
        const trimmedName = name.trim();
        if (!trimmedName) {
            throw new Error("Board name is required");
        }
        return boardRepository.create(trimmedName);
    },
    async updateBoard(id, name) {
        const trimmedName = name.trim();
        if (!trimmedName) {
            throw new Error("Board name is required");
        }
        await this.getBoardById(id);
        return boardRepository.update(id, trimmedName);
    },
    async deleteBoard(id) {
        await this.getBoardById(id);
        return boardRepository.delete(id);
    },
};
