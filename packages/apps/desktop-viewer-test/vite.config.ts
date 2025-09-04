import { defineConfig, UserConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from '@vitejs/plugin-react';
import path from 'node:path';

const ENV_PREFIX = "IMJS_";

export default defineConfig((): UserConfig => {
  return {
    build: {
      chunkSizeWarningLimit: 9000, // Increase chunk size warning limit to avoid warnings for large chunks
    },
    server: {
      port: 3000,
      strictPort: true, // exit if port is already in use
      fs: {
        allow: [
          // Allow serving files from root of the monorepo
          path.resolve(process.cwd(), '../../..')
        ],
      },
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
      })
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