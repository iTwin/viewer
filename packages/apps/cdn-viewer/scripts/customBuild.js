const rewire = require("rewire");
const defaults = rewire("@bentley/react-scripts/scripts/build.js");
let config = defaults.__get__("config");

/**
 * Remove chunking and hash from javascript bundle filename
 */
config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
};

// enable this for testing
// config.optimization.minimize = false;

config.optimization.runtimeChunk = false;
if (process.env.NODE_ENV === "production") {
  config.output.filename = "static/js/itwin-viewer-react.js";
} else {
  config.output.filename = "static/js/bundle.js";
}

/**
 * Remove chunking and hash from css bundle filename
 */
for (let i = 0; i < config.plugins.length; i++) {
  if (
    config.plugins[i].options &&
    config.plugins[i].options.filename &&
    config.plugins[i].options.filename.indexOf("static/css/") >= 0
  ) {
    config.plugins[i].options.filename = "static/css/itwin-viewer-react.css";
    delete config.plugins[i].options.chunkFilename;
    break;
  }
}
