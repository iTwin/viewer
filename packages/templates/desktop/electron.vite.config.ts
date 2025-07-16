import { defineConfig } from 'electron-vite';
import react from "@vitejs/plugin-react";
import type { Plugin } from 'vite';

function fixSassTildeImport(): Plugin {
  return {
    name: 'fix-sass-tilde-import',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.scss') || id.endsWith('.sass')) {
        return {
          code: code.replace(/(@(use|import)\s+['"])~([^'"]+)/g, '$1$3'),
          map: null,
        };
      }
    },
  };
}


export default defineConfig({
  main: {
    entry: 'src/main/main.ts',
  },
  renderer: {
    input: 'src/renderer/index.html',
    plugins: [react(), fixSassTildeImport()],
  },
  // resolve: {
  //   alias: [
  //     {
  //       // Resolve SASS tilde imports.
  //       find: /^~(.*)$/,
  //       replacement: "$1",
  //     },
  //   ],
  // },
  // optimizeDeps: {
  //   include: ["@itwin/components-react/lib/components-react/editors/EnumEditor.scss"]
  // }
  // resolve: {
  //     alias: [
  //       {
  //         // Resolve SASS tilde imports.
  //         find: /^~(.*)$/,
  //         replacement: "$1",
  //       },
  //     ],
  //   },
});
