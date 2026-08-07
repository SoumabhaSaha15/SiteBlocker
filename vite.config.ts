import path from "path";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

const pkg = readJsonFile("package.json");
const manifest = readJsonFile("src/manifest.json");

export default defineConfig((_) => {
  return ({
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
    plugins: [
      tailwindcss(),
      react(),
      svgr(),
      webExtension({
        manifest: () => ({
          name: pkg.name,
          description: pkg.description,
          version: pkg.version,
          ...manifest,
        }),
        additionalInputs: ["src/index.html"],
      }),
    ],
  })
});
