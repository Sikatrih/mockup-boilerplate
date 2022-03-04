const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const path = require('path');
const paths = require('./paths');
const { grabFiles, getFileName } = require('./utils');
const { getTwigData } = require('./twig-data');

module.exports = {
  context: paths.src,
  entry: {
    app: `./scripts/index.js`,
  },
  output: {
    filename: `scripts/[name].[hash:8].js`,
    path: paths.build,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer', 'postcss-flexbugs-fixes'],
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.twig$/,
        use: [
          'raw-loader',
          {
            loader: 'twig-html-loader',
            options: {
              data: getTwigData
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/fonts',
            outputPath: 'fonts',
            name: '[name].[hash:8].[ext]',
          },
        },
      },
      {
        test: /\.(gif|ico|jpe?g|png|webp)$/, // svg
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/images',
            outputPath: 'images',
            name: '[name].[hash:8].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              // publicPath: '/icons'
            }
          },
          'svg-transform-loader',
          'svgo-loader'
        ]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].[hash:8].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.static,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.twig',
    }),
    ...grabFiles('src/templates', 'twig').map(file => {
      const filename = getFileName(file);

      return new HtmlWebpackPlugin({
        filename: `${filename}.html`,
        template: `templates/${filename}.twig`,
        minify: false
      });
    }),
    new SpriteLoaderPlugin()
  ],
};
