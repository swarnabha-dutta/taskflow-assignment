import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 TaskFlow API running on port ${PORT}`);
});

const shutdown = () => {
    console.log("🛑 Shutting down server...");

    server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);