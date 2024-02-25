import { configDefaults, mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "../vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, "test/**/*.test.{ts,js}"],
      name: "unit-tests",
      environment: "node"
    }
  })
);
