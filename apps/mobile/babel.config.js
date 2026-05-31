module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // This inline plugin replaces process.env.EXPO_ROUTER_APP_ROOT at build time
      ["transform-inline-environment-variables", {
        "include": ["EXPO_ROUTER_APP_ROOT", "EXPO_ROUTER_IMPORT_MODE", "NODE_ENV"]
      }]
    ]
  };
};
