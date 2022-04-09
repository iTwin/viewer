// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

"use strict";

import copyfiles from "copyfiles";
import path from "path";

const nodeModulesPath = "./node_modules/";

// copy i18n files
const i18nToCopy = [
  "appui-abstract",
  "browser-authorization",
  "core-common",
  "core-frontend",
  "core-geometry",
  "core-orbitgt",
  "core-quantity",
  "presentation-common",
  "webgl-compatibility",
  "select-tool-extension-sample",
];
const i18nTargetPath = "public";

i18nToCopy.forEach((pkg) => {
  const i18nSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/locales/**/*.json"
  );

  try {
    copyfiles([i18nSrcPath, i18nTargetPath], { up: 5 }, () => {
      console.log(
        `i18n for ${pkg} sucessfully copied from ${i18nSrcPath} to ${i18nTargetPath}`
      );
    });
  } catch (e) {
    console.log(e);
    /** nop */
  }
});

// copy cursors
const cursorsToCopy = ["core-frontend"];
const cursorsTargetPath = "public";

cursorsToCopy.forEach((pkg) => {
  const cursorsSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/cursors/**"
  );

  try {
    copyfiles([cursorsSrcPath, cursorsTargetPath], { up: 5 }, () => {
      console.log(
        `i18n for ${pkg} sucessfully copied from ${cursorsSrcPath} to ${cursorsTargetPath}`
      );
    });
  } catch (e) {
    console.log(e);
    /** nop */
  }
});

// copy sprites
const spritesToCopy = ["core-frontend"];
const spritesTargetPath = "public";

spritesToCopy.forEach((pkg) => {
  const spritesSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/sprites/**"
  );

  copyfiles([spritesSrcPath, spritesTargetPath], { up: 5 }, () => {
    console.log(
      `i18n for ${pkg} sucessfully copied from ${spritesSrcPath} to ${spritesTargetPath}`
    );
  });
});

// copy images
const imagesToCopy = ["core-frontend"];
const imagesTargetPath = "public";

imagesToCopy.forEach((pkg) => {
  const imagesSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/images/**"
  );
  copyfiles([imagesSrcPath, imagesTargetPath], { up: 5 }, () => {
    console.log(
      `i18n for ${pkg} sucessfully copied from ${imagesSrcPath} to ${imagesTargetPath}`
    );
  });
});

// copy assets
const assetsToCopy = ["core-frontend"];
const assetsTargetPath = "public";

assetsToCopy.forEach((pkg) => {
  const assetsSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/assets/**"
  );
  copyfiles([assetsSrcPath, assetsTargetPath], { up: 5 }, () => {
    console.log(
      `i18n for ${pkg} sucessfully copied from ${assetsSrcPath} to ${assetsTargetPath}`
    );
  });
});
