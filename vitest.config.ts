import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Separate from vite.config.ts on purpose: that file's config comes from
// @lovable.dev/vite-tanstack-config (tanstackStart + nitro + prerender), none of which belongs
// in a unit-test run. This gives the test run just what it needs: the `@` path alias and JSX.
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // No `globals: true` — test files import describe/it/expect/vi explicitly from "vitest",
    // same explicit-import style as the rest of this codebase, and avoids adding ambient
    // globals to tsconfig's `types` just for tests.
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
});
