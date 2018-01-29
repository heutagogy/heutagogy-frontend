/* eslint-disable import/no-commonjs*/
/* eslint-disable import/no-nodejs-modules*/
/* eslint-disable fp/no-mutation*/
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = [
  new webpack.ProvidePlugin({
    React: 'react',
  }),
  new webpack.ProvidePlugin({
    jQuery: 'jquery',
  }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    title: 'Heutagogy',
    favicon: './favicon.ico',
    inject: 'body',
    inlineSource: '.css$',
  }),
  new HtmlWebpackInlineSourcePlugin(),
  new webpack.LoaderOptionsPlugin({
    test: /\.less$/,
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        }),
      ],
    },
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new CompressionPlugin({
    test: [/\.js/, /\.css/, /\.html/],
  }),
];
