import { Router } from "express";
import {
    createColumn,
    deleteColumn,
    getColumnById,
    getColumnsByBoardId,
    updateColumn,
} from "../controllers/column.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get(
    "/board/:boardId",
    asyncHandler(getColumnsByBoardId),
);

router.get("/:id", asyncHandler(getColumnById));

router.post(
    "/board/:boardId",
    asyncHandler(createColumn),
);

router.patch("/:id", asyncHandler(updateColumn));

router.delete("/:id", asyncHandler(deleteColumn));

export default router;