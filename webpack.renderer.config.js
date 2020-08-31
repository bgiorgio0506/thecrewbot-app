const webpack = require('webpack')
const path = require('path')
const rules = require('./webpack.rules')

//const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  module: {
    rules: rules.rulesProd
  },
  resolve: {
    alias:{
      "@renderer": "./src/",
      "@main": "./src/"
    },
    extensions: ['*', '.js', '.jsx']
  },
  output:{
    path:path.resolve(__dirname,'./.webpack/renderer/'),
    filename:'index.js'
  },
  target: 'electron-renderer',
  plugins: [
    /*new HtmlWebpackPlugin({
      title:'My App', 
      filename:'./main_window/index.html', 
      scriptLoading:'defer'
    }),*/
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'bundle.css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    //new BabiliPlugin(),
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  }
}