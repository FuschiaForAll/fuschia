// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues()
exports.resolver = {
  ...defaultResolver,
  sourceExts: [...defaultResolver.sourceExts, 'cjs'],
}
