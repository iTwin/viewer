import { defineConfig, UserConfig } from 'vite';
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from '@vitejs/plugin-react';

const ENV_PREFIX = "IMJS_";

export default defineConfig((): UserConfig => {
  return {
    build: {
      chunkSizeWarningLimit: 7000, // Increase chunk size warning limit to avoid warnings for large chunks
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
    ],
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