import path from "path";
import { defineConfig } from "vite";
// import zip from 'vite-plugin-zip-pack';
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config.ts";
import tailwindcss from "@tailwindcss/vite";
// import pkg from './package.json' with { type: "json" };

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    crx({
      manifest, contentScripts: {
        standaloneFiles: ['src/content/main.tsx'],
      },
      liveReload:true
    }),
    // zip({ outDir: 'release', outFileName: `site-blocker-${pkg.version}.zip` }),
  ],
  build: {
    rolldownOptions: {
      input: {
        index: "src/page/index.html",
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
