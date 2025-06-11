const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('ts', 'tsx', 'tssx'); // Add tssx if you must keep it
module.exports = config;