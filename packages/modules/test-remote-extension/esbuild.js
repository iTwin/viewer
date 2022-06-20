import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import path from "path";
import esbuild from "esbuild";
import { fileURLToPath } from "url";
import { argv } from "process";

const dir = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/");
const arg = argv.length > 2 ? argv[2] : undefined;

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    watch: arg === "--watch" ? true : false,
    bundle: true,
    minify: true,
    sourcemap: true,
    define: { global: "window", __dirname: `"${dir}"` },
    inject: ["./esbuild.injection.js"],
    outfile: "dist/index.js",
    plugins: [new NodeGlobalsPolyfillPlugin(), new NodeModulesPolyfillPlugin()],
    loader: {
      ".svg": "dataurl",
      ".woff": "dataurl",
      ".eot": "dataurl",
      ".ttf": "dataurl",
      ".woff2": "dataurl",
      ".cur": "dataurl",
    },
    format: "esm",
  })
  .catch(() => process.exit(1));
