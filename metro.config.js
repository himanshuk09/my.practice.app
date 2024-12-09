// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Apply nativewind and SVG transformer configurations
const customConfig = {
  ...config,
  transformer: {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  },
  resolver: {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
  },
};

// Wrap config with NativeWind
module.exports = withNativeWind(customConfig, { input: "./global.css" });
