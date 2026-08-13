import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient, Priority } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaLibSql({
    url: databaseUrl,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("🌱 Starting database seed...");

    await prisma.task.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();

    const board = await prisma.board.create({
        data: {
            name: "TaskFlow Board",

            columns: {
                create: [
                    {
                        name: "To Do",
                        position: 0,

                        tasks: {
                            create: [
                                {
                                    title: "Setup project",
                                    description: "Initialize the TaskFlow project structure.",
                                    priority: Priority.HIGH,
                                },
                                {
                                    title: "Design database",
                                    description: "Design Board, Column and Task relationships.",
                                    priority: Priority.MEDIUM,
                                },
                            ],
                        },
                    },
                    {
                        name: "In Progress",
                        position: 1,

                        tasks: {
                            create: [
                                {
                                    title: "Build backend API",
                                    description: "Implement TaskFlow REST API.",
                                    priority: Priority.HIGH,
                                },
                            ],
                        },
                    },
                    {
                        name: "Done",
                        position: 2,

                        tasks: {
                            create: [
                                {
                                    title: "Initialize Prisma",
                                    description: "Configure Prisma with SQLite.",
                                    priority: Priority.LOW,
                                },
                            ],
                        },
                    },
                ],
            },
        },
        include: {
            columns: {
                include: {
                    tasks: true,
                },
            },
        },
    });

    console.log(`✅ Board created: ${board.name}`);

    for (const column of board.columns) {
        console.log(
            `   ${column.name}: ${column.tasks.length} task(s)`,
        );
    }

    console.log("🌱 Database seed completed successfully.");
}

main()
    .catch((error) => {
        console.error("❌ Database seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });