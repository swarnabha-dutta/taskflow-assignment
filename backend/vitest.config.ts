import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,

        // Run test files sequentially
        fileParallelism: false,

        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
    },
});