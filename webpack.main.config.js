const webpack = require('webpack')
const path = require('path')
const rules = require('./webpack.rules')
const Dotenv = require('dotenv-webpack');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  module: {
    rules: rules.rulesProd,
  },
  externals: {
    'fs-extra': 'commonjs2 fs-extra',
  },
  devServer:{
    historyApiFallback: true
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new Dotenv(),
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
//
  ],
  target: 'electron-main',
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  }
}

/** 
 * Reference for the obfuscator
 *            compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.75,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 1,
              debugProtection: false,
              debugProtectionInterval: false,
              disableConsoleOutput: false,
              domainLock: [],
              identifierNamesGenerator: 'hexadecimal',
              identifiersDictionary: [],
              identifiersPrefix: '',
              inputFileName: '',
              log: false,
              numbersToExpressions: true,
              optionsPreset: 'default',
              renameGlobals: true,
              renameProperties: true,
              reservedNames: [],
              reservedStrings: [],
              rotateStringArray: true,
              seed: 0,
              selfDefending: false,
              shuffleStringArray: true,
              simplify: true,
              splitStrings: false,
              splitStringsChunkLength: 10,
              stringArray: true,
              stringArrayEncoding: [],
              stringArrayWrappersCount: 1,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersType: 'variable',
              stringArrayThreshold: 0.75,
              target: 'browser',
              unicodeEscapeSequence: false
 */