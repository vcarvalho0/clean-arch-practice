import { mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "../vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["test/**/*.test.{ts,js}"],
      name: "e2e-tests",
      environment: "node"
    }
  })
);
