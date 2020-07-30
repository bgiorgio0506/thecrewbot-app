const webpack = require('webpack')
const path = require('path')
const rules = require('./webpack.rules')
module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  module: {
    rules: rules.rulesProd
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  target: 'electron-main',
}