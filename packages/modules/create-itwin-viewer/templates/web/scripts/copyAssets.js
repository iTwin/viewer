// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

"use strict";

import cpx from "cpx";
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
const i18nTargetPath = "public/locales/";

i18nToCopy.forEach((pkg) => {
  const i18nSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/locales/**/*.json"
  );

  cpx.copy(i18nSrcPath, i18nTargetPath, { dereference: true }, (err) => {
    if (err) {
      throw err;
    }

    console.log(
      `i18n for ${pkg} sucessfully copied from ${i18nSrcPath} to ${i18nTargetPath}`
    );
  });
});

// copy cursors
const cursorsToCopy = ["core-frontend"];
const cursorsTargetPath = "public/cursors";

cursorsToCopy.forEach((pkg) => {
  const cursorsSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/cursors/**"
  );
  cpx.copy(cursorsSrcPath, cursorsTargetPath, { dereference: true }, (err) => {
    if (err) {
      throw err;
    }

    console.log(
      `cursors for ${pkg} sucessfully copied from ${cursorsSrcPath} to ${cursorsTargetPath}`
    );
  });
});

// copy sprites
const spritesToCopy = ["core-frontend"];
const spritesTargetPath = "public/sprites";

spritesToCopy.forEach((pkg) => {
  const spritesSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/sprites/**"
  );
  cpx.copy(spritesSrcPath, spritesTargetPath, { dereference: true }, (err) => {
    if (err) {
      throw err;
    }

    console.log(
      `sprites for ${pkg} sucessfully copied from ${spritesSrcPath} to ${spritesTargetPath}`
    );
  });
});

// copy images
const imagesToCopy = ["core-frontend"];
const imagesTargetPath = "public/images";

imagesToCopy.forEach((pkg) => {
  const imagesSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/images/**"
  );
  cpx.copy(imagesSrcPath, imagesTargetPath, { dereference: true }, (err) => {
    if (err) {
      throw err;
    }

    console.log(
      `images for ${pkg} sucessfully copied from ${imagesSrcPath} to ${imagesTargetPath}`
    );
  });
});

// copy assets
const assetsToCopy = ["core-frontend"];
const assetsTargetPath = "public/assets";

assetsToCopy.forEach((pkg) => {
  const assetsSrcPath = path.join(
    nodeModulesPath,
    "@itwin",
    pkg,
    "lib/public/assets/**"
  );
  cpx.copy(assetsSrcPath, assetsTargetPath, { dereference: true }, (err) => {
    if (err) {
      throw err;
    }

    console.log(
      `assets for ${pkg} sucessfully copied from ${assetsSrcPath} to ${assetsTargetPath}`
    );
  });
});
