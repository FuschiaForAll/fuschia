const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: path.resolve(__dirname, './src/lib/index.js'),
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["module:metro-react-native-babel-preset"],
            plugins: ["react-native-web"],
          },
        }
      },
    ]
  },
  externals: {
    react: 'React',
    'react-native': 'ReactNative',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: [
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
      '.web.react.js',
      '.react.js',
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js',
    library: '@fuchsia-for-all/primitives',
    libraryTarget: 'window',
  }
}