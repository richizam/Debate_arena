import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const removeModuleType = {
  name: "remove-module-type",
  transformIndexHtml(html: string) {
    return html
      .replace(/type="module" /g, "")
      .replace(/ crossorigin/g, "");
  },
};

export default defineConfig({
  plugins: [react(), removeModuleType],
  base: "./",
  server: { port: 3000 },
  build: {
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
      },
    },
  },
});
