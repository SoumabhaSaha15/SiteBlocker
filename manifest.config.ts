import { defineManifest } from "@crxjs/vite-plugin";
import pkg from './package.json' with { type: "json" };

export default defineManifest({
  manifest_version: 3,
  name: "SiteBlockerByWebdude",
  version: pkg.version,
  description: pkg.description,
  icons: {
    16: "icon/16.png",
    32: "icon/32.png",
    48: "icon/48.png",
    96: "icon/96.png",
    128: "icon/128.png"
  },
  // content_scripts: [{
  //   js: ['src/content/main.tsx'],
  //   matches: ['<all_urls>'],
  //   run_at:"document_start",
  // }],
  action: {},
  background: {
    service_worker: "src/background.ts"
  },
  permissions: [
    "contextMenus",
    "storage",
    "tabs"
  ]
});
