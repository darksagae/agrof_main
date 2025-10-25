const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .js files in data directory
config.resolver.sourceExts.push('js');

module.exports = config;

