module.exports = function override(config, env) {
  // Remove original rule for SVGs
  config.module.rules[1].oneOf.splice(2, 1)

  // Add new rule for SVGs with SVGR
  config.module.rules.splice(1, 0, {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          prettier: false,
          svgo: false,
          svgoConfig: { plugins: [Array] },
          titleProp: true,
          ref: true,
        },
      },
    ],
  })

  // Make sure SVGs don't get parsed as a assets
  const lastItem = config.module.rules[2].oneOf.slice(-1)[0]
  lastItem.exclude.push(/\.svg$/i)

  return config
}
