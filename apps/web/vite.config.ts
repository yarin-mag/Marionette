import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? "/Marionette/" : "/",
  server: {
    port: 5173
  },
  test: {
    environment: "node",
  },
});
