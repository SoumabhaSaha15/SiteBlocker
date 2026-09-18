import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pkg from './package.json' with { type: "json" };
import { crx, defineManifest } from "@crxjs/vite-plugin";
import baseManifest from './src/manifest.json' with { type: "json" };

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
      crx({ manifest }),
    ],
    build: {
      rollupOptions: {
        input: {
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
