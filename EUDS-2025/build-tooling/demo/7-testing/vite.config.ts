/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    proxy: {
      "/arcgis": {
        target: "https://places-api.arcgis.com",
        changeOrigin: true,
      },
    },
  },
  // plugin for react to compile jsx syntax
  plugins: [react()],
  // test property declares how we want our tests to run
  test: {
    setupFiles: "./src/setupTests.ts",
    browser: {
      enabled: true, // will run in browser
      provider: "playwright", // driver for the browser
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: "chromium" }],
    },
    onConsoleLog: (msg) => {
      const ignores = [/^Lit is in dev mode/u, /^Using Calcite Components/u];
      return !ignores.some((re) => re.test(msg));
    },
  },
});
