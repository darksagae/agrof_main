const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for resolving assets
config.resolver.assetExts.push(
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg'
);

module.exports = config;
