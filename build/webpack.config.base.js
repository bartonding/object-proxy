const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, '..');

let config = {

  context: SRC_DIR,

  module: {},
  plugins: [
    new CleanWebpackPlugin(['../dist'], {allowExternal: true})
  ]
};

config.module.rules = [
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  }
];

module.exports = config;
