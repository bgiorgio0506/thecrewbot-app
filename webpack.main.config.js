const webpack = require('webpack')
const path = require('path')
const rules = require('./webpack.rules')
const Dotenv = require('dotenv-webpack');
module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  module: {
    rules: rules.rulesProd,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new Dotenv()
  ],
  target: 'electron-main',
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  }
}