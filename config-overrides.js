const webpack = require("webpack");

const stringifyConfig = (key, value) => {
  if (value instanceof RegExp) {
    return value.toString();
  }
  return value;
};

module.exports = function override(config, env) {
  config.resolve.fallback = {
    url: require.resolve("url"),
    assert: require.resolve("assert"),
    buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    "process/browser": require.resolve("process/browser")
  };

  config.plugins.push(new webpack.ProvidePlugin({
    process: "process/browser.js",
    Buffer: ["buffer", "Buffer"],
  }));

  config.module.rules.push({
    test: /\.md/,
    type: "asset/source",
  });

  return config;
};