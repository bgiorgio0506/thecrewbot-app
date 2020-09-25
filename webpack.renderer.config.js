const webpack = require('webpack')
const path = require('path')
const rules = require('./webpack.rules')

const BabiliPlugin = require('babili-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MediaQueryPlugin = require('media-query-plugin')
//plugins 
const Dotenv = require('dotenv-webpack');
const WebpackObfuscator = require('webpack-obfuscator');

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
    filename:'index.js', 
    publicPath: '/'
  },
  devServer:{
    historyApiFallback: true, 
    contentBase:'./',
    hot:true
  },
  devtool:'source-map',
  target: 'electron-renderer',
  plugins: [
    //use dotenv in the renderer process
    new Dotenv(),

    //css extraction
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'bundle.css',
      chunkFilename: '[id].css'
    }),

    //media queries in css
    new MediaQueryPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  
  //let's hide our code 
  /*new WebpackObfuscator ({
    compact: true,
    identifierNamesGenerator: 'hexadecimal',
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    rotateStringArray: true,
    target:'browser',
    debugProtection: false,
    disableConsoleOutput: false,
    reservedStrings:['tmi.js', 'utf-8-validate', 'bufferutil', './lang/it.json', './lang/en.json', 'app.css'], 
    renameGlobals: true, 
    renameProperties: true, 
    stringArray: true,
    shuffleStringArray: true, 
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: false,
    log: false,
    numbersToExpressions: true,
    optionsPreset: 'default',
  }, [])*/
    //new BabiliPlugin(),
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  }
}