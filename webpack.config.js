const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const autoprefixer = require('autoprefixer');

const PAGES_DIR = './src/pug/pages/';
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith('.pug'));

const config = {
  target: 'web',
  entry: ['./src/js/index.js', './src/scss/style.scss'],
  output: {
    filename: './js/bundle.js',
  },
  devtool: 'source-map',
  mode: 'production',
  // optimization: {
  //   minimizer: [
  //     new TerserPlugin({
  //       sourceMap: true,
  //       extractComments: true
  //     })
  //   ]
  // },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules[\/\\](?!(swiper|dom7|ssr-window)[\/\\])/],
        loader: 'babel-loader',
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
              importLoaders: 1,
              modules: {
                mode: 'icss',
              },
            },
          },

          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                sourceMap: true,
                plugins: () => [
                  // autoprefixer({ grid: true }),
                  require('cssnano')({
                    preset: [
                      'default',
                      {
                        calc: false,
                        discardComments: {
                          removeAll: true,
                        },
                      },
                    ],
                  }),
                ],
              },
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
      // {
      //   test: /\.html$/,
      //   include: path.resolve(__dirname, 'src/html/includes'),
      //   use: ['raw-loader'],
      // },
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/style.bundle.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/fonts',
          to: './fonts',
        },
        {
          from: './src/static',
          to: './',
        },
        {
          from: './src/assets',
          to: './assets',
        },
      ],
    }),
    new SpriteLoaderPlugin({ plainSprite: true }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, '.html')}`,
        })
    ),
  ], //.concat(htmlPlugins)
  devServer: {
    static: true,
    historyApiFallback: true,
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
