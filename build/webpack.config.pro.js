const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const webpackConfigBase = require('./webpack.config.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin')
const moment = require('moment')

let config = webpackMerge({}, webpackConfigBase, {
  mode: 'production',
  target: 'web',
  
  entry: {
    'object.proxy': './src/ObjectProxy.js',
  },

  output: {
    path: path.resolve(__dirname, "../lib"),
    publicPath : './',
    filename: "[name].js",
    library: 'ObjectProxy',
    libraryTarget: 'umd'
  },

  optimization: {
    minimizer: [new UglifyJsPlugin({
      // test: /\.min\.js$/i
    })],
  },

  plugins: [
    new CleanWebpackPlugin(['../lib'], {allowExternal: true}),
    new webpack.BannerPlugin({
      banner: moment().format('YYYY-MM-DD HH:mm:ss'),
      entryOnly: true
    }),
    new ReplaceInFileWebpackPlugin([{
      dir: 'lib',
      test: /\.js$/,
      rules: [{search: /\(window\,\s*function\s*\(\)/i, replace: '(this,function()'}]
    }])
  ],
})

module.exports = config
