const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path');
const defaultInclude = path.resolve(__dirname, 'src')
const WebpackObfuscator = require('webpack-obfuscator');
const MediaQueryPlugin = require('media-query-plugin')

module.exports.rulesDev = [
    {
        test: /\.node$/,
        use: 'node-loader',
        include: defaultInclude
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@marshallofsound/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      },
      {
        test: /\.node$/,
        use: "node-loader",
        include: defaultInclude
    },
    {
      test: /\.css$/,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      include: defaultInclude
    },
    {
      test: /\.jsx?$/,
      use: [{ loader: 'babel-loader' }],
      include: defaultInclude
    },
    {
      test: /\.(jpe?g|png|gif)$/,
      use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
      include: defaultInclude
    },
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
      include: defaultInclude
    }, 
    {
      test: /\.js$/,
      exclude: [ 
          path.resolve(__dirname, 'excluded_file_name.js') 
      ],
      enforce: 'post',
      use: { 
          loader: WebpackObfuscator.loader, 
          options: {
              rotateStringArray: true
          }
      }
  }
  ]

  module.exports.rulesProd = [
    {
      test: /\.node$/,
      use: "node-loader",
      include: defaultInclude
  },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@marshallofsound/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      },
    {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true,
            hmr: process.env.APP_DEBUG === 'true',
            publicPath : '/'
          },
        },
        {
          loader: 'css-loader',
          options: {
            esModule: true
          },
        },
        MediaQueryPlugin.loader,
      ],
      include: defaultInclude
    },
    {
      test: /\.jsx?$/,
      use: [{ loader: 'babel-loader' }],
      include:defaultInclude
    },
    {
      test: /\.(jpe?g|png|gif)$/,
      use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
      include: defaultInclude
    },
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
      include: defaultInclude
    },
    {
      test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
      resolve: {
        aliasFields: ['renderer']
      }
    }
  ]