import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import child_process from "node:child_process";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function main() {
    await fs.promises.rm(path.join(dirname, "app"), { recursive: true, force: true });

    if (!process.env.SKIP_BUNDLE) {
        console.log("esbuild...");
        await esbuild.build({
            bundle: true,
            platform: "node",
            outdir: path.join(dirname, "app"),
            target: "node20",
            sourcemap: true,
            external: [
                "@bentley/imodeljs-native",
                "regedit",
                "electron",
                "@itwin/core-electron/lib/cjs/backend/ElectronPreload.js",
                "./ElectronPreload.js",
            ],
            // FIXME: why doesn't tsconfig.backend.json cause commonjs resolution?
            conditions: ["require"],
            tsconfig: path.join(dirname, "tsconfig.backend.json"),
            loader: {
                ".xml": "text",
                // TODO?: ".wasm": "copy",
            },
            entryPoints: [
                path.join(dirname, "src/backend/main.ts"),
            ],
            define: {
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
                // "globalThis.COMMIT_HASH": JSON.stringify(
                //   child_process.execFileSync(
                //     "git",
                //     ["rev-parse", "HEAD"],
                //     { encoding: "utf8" }
                //   )
                // ),
            },
        });
        console.log("done!");
    }

    console.log("copying files...");
    await fs.promises.mkdir(
        path.join(dirname, "app/node_modules/@bentley"),
        { recursive: true }
    );
    await Promise.all([
        fs.promises.cp(
            path.join(
                dirname,
                "node_modules/@itwin/core-electron/lib/cjs/backend/ElectronPreload.js"
            ),
            path.join(dirname, "app/ElectronPreload.js")
        ),
        ...(
            process.env.SKIP_COPY_IMJS_NATIVE
                ? []
                : [
                    fs.promises.cp(
                        path.join(dirname, "node_modules/@bentley/imodeljs-native"),
                        path.join(dirname, "app/node_modules/@bentley/imodeljs-native"),
                        { recursive: true }
                    ),
                ]
        ),
        fs.promises.cp(
            path.join(dirname, "node_modules/regedit"),
            path.join(dirname, "app/node_modules/regedit"),
            { recursive: true }
        ),

        fs.promises.cp(
            path.join(dirname, "node_modules/bytenode"),
            path.join(
                dirname,
                "app/node_modules/bytenode"
            ),
            { recursive: true }
        ),
    ]);

    const webDest = path.join(dirname, "app/web");
    await fs.promises.rm(webDest, { recursive: true, force: true });
    const distSrc = path.join(dirname, "dist");
    if (fs.existsSync(distSrc)) {
        await fs.promises.cp(distSrc, webDest, { recursive: true });
    }

    fs.copyFileSync(
        path.join(dirname, "resources/package.json"),
        path.join(dirname, "app/package.json")
    );

    console.log("done");
}

void main();
