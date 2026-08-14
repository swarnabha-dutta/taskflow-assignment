import express from "express";
import cors from "cors";
import boardRoutes from "./routes/board.routes.js";
import columnRoutes from "./routes/column.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
const app = express();
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "TaskFlow API is running",
    });
});
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);
// Centralized error handler
app.use(errorMiddleware);
export default app;
