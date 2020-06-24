const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: "./monaco/editor.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'www', 'monaco'),
    filename: 'monaco.js'
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.ttf$/,
      use: ['file-loader']
    }]
  },
  optimization: {
    usedExports: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MonacoWebpackPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ]
}