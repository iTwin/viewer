/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
module.exports = {
  presets: ["@babel/preset-env", "@babel/react"],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/proposal-class-properties",
    "babel-plugin-import-remove-resource-query",
  ],
};
