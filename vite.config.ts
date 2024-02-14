/// <reference types="vitest" />
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["test/**/*.test.{ts,js}"],
    name: "e2e-tests",
    environment: "node"
  },
  plugins: [tsconfigPaths()]
});
