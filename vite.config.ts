import path from "path";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pkg from './package.json' with { type: "json" };
import { crx, defineManifest } from "@crxjs/vite-plugin";
import baseManifest from './src/manifest.json' with { type: "json" };
// import webExtension, { readJsonFile } from "vite-plugin-web-extension";
// const pkg = readJsonFile("package.json");
// const manifest = readJsonFile("src/manifest.json");
const manifest = defineManifest({
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,
  ...baseManifest,
});
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
      svgr({
        include: "src/**/*.svg?react",
        exclude: "node_modules/**",
        svgrOptions: {
          icon: true,
        },
      }),
      crx({ manifest }),
      // webExtension({
      //   manifest: () => ({
      //     name: pkg.name,
      //     description: pkg.description,
      //     version: pkg.version,
      //     ...manifest,
      //   }),
      //   additionalInputs: ["src/index.html", "src/redirect.html"],
      // }),
    ],
    build: {
      // build.rolldownOptions.output.codeSplitting
      rollupOptions: {
        input: {
          // Use relative paths from project root
          index: "src/index.html",
          redirect: "src/redirect.html",
        },
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@mui") || id.includes("@emotion")) {
                return "vendor-mui";
              }
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor-react";
              }
              return "vendor";
            }
          },
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
    }
  })
});
