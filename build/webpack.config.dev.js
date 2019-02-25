const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const webpackConfigBase = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let config = webpackMerge({}, webpackConfigBase, {
  mode: 'development',
  
  entry: {
    'test': './test/index.js'
  },

  output: {
    publicPath : '/',
    filename: "[name].js"
  },

  devServer: {
    allowedHosts: ['.qq.com'],
    port: 80,
    // open: 'Chrome',
    overlay: true,
    // writeToDisk: true,
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['test'],
      template: path.resolve(__dirname, '../index.html')
    })
  ],
})

module.exports = config
