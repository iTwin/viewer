import { cpSync, rmSync } from 'fs';
import { resolve } from 'path';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from "vite-plugin-static-copy";

const ENV_PREFIX = "IMJS_";

export default defineConfig((): UserConfig => {
  return {
    build: {
      chunkSizeWarningLimit: 9000, // Increase chunk size warning limit to avoid warnings for large chunks
    },
    server: {
      port: 3000,
      strictPort: true, // exit if port is already in use
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            // copy assets from `@itwin` dependencies
            src: "./node_modules/**/@itwin/*/lib/public/*",
            dest: ".",
          },
        ],
      }),
      nodePolyfills({
        include: ["fs", "path"]
      }),
      {
        name: "copy-to-app-web",
        closeBundle() {
          const dest = resolve(__dirname, "app/web");
          rmSync(dest, { recursive: true, force: true });
          cpSync(resolve(__dirname, "dist"), dest, { recursive: true });
        },
      },
    ],
    resolve: {
      alias: [
        {
          // Resolve SASS tilde imports.
          find: /^~(.*)$/,
          replacement: "$1",
        }
      ],
    },
    envPrefix: ENV_PREFIX
  };
});