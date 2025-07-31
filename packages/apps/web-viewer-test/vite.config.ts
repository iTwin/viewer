import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";
import path from "node:path";

const ENV_PREFIX = "IMJS_";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    build: {
      chunkSizeWarningLimit: 7000, // Increase chunk size warning limit to avoid warnings for large chunks
    },
    plugins: [
      react(),
      svgr(),
      viteStaticCopy({
        targets: [
          {
            // copy assets from `@itwin` dependencies
            src: "./node_modules/**/@itwin/*/lib/public/*",
            dest: ".",
          },
        ],
      }),
    ],
    server: {
      port: 3000,
      strictPort: true,
      open: true,
      fs: {
        allow: [
          // Allow serving files from root of the monorepo
          path.resolve(process.cwd(), '../../..')
        ],
      },
    },
    resolve: {
      alias: [
        {
          // Resolve SASS tilde imports.
          find: /^~(.*)$/,
          replacement: "$1",
        },
      ],
    },
    envPrefix: ENV_PREFIX
  };
});