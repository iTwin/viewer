import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react";

const ENV_PREFIX = "IMJS_";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
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
    server: {
      port: 3000,
      strictPort: true,
      open: true
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