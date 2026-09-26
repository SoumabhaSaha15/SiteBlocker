import path from "path";
import { defineConfig } from "vite";
import zip from 'vite-plugin-zip-pack';
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";
import tailwindcss from "@tailwindcss/vite";
import pkg from './package.json' with { type: "json" };

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `site-blocker-${pkg.version}.zip` }),
  ],
  build: {
    rollupOptions: {
      input: {
        index: "src/page/index.html",
        redirect: "src/redirect/index.html",
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
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
});
