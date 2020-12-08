const presets = [["@babel/preset-env", { targets: { node: "current" } }]];
const plugins = ["@babel/plugin-proposal-class-properties"];
const env = {
  debug: {
    sourceMaps: "inline",
    retainLines: true,
  },
};

module.exports = {
  presets,
  env,
  plugins,
};
