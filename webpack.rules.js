const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path');
const defaultInclude = path.resolve(__dirname, 'src')

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
    }
  ]

  module.exports.rulesProd = [
    {
        test: /\.node$/,
        use: 'node-loader',
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
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ],
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
    }
  ]