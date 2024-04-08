/// <reference types="vitest" />
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environmentMatchGlobs: [["test/functional/**", "prisma"]]
  },
  plugins: [tsconfigPaths()]
});
