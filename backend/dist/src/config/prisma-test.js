import "dotenv/config";
import { prisma } from "./prisma.js";
async function main() {
    const result = await prisma.$queryRaw `SELECT 1 as result`;
    console.log("Database connection successful:", result);
}
main()
    .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
