/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const dir = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "~@itwin/itwinui-css",
        replacement: "@itwin/itwinui-css",
      },
      {
        find: "~@itwin/core-react",
        replacement: "@itwin/core-react",
      },
      {
        find: "~@itwin/appui-layout-react",
        replacement: "@itwin/appui-layout-react",
      },
      {
        find: "@itwin/itwinui-react/cjs",
        replacement: "@itwin/itwinui-react/esm",
      },
    ],
  },
  css: {
    preprocessorOptions: {
      includePaths: ["node_modules"],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
      loader: {
        ".svg": "dataurl",
        ".woff": "dataurl",
        ".eot": "dataurl",
        ".ttf": "dataurl",
        ".woff2": "dataurl",
        ".cur": "dataurl",
      },
    },
  },
});
