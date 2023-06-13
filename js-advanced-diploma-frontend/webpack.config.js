/* eslint-disable no-undef */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SpritePlugin = require('svg-sprite-loader/plugin');
const HtmlValidatePlugin = require('html-validate-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = (env) => ({
  entry: './src/scripts/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: useJavascript(env),
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          env.production ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        exclude: [path.resolve(__dirname, './src/images/svg/')],
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, './src/images/svg/')],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              // publicPath: '/',
            },
          },
          'svgo-loader',
        ],

        // use: 'svg-sprite-loader',
      },
    ],
  },
  devServer: {
    static: './dist',
    historyApiFallback: true,
    // hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Сoin.',
      favicon: './src/images/favicon.ico',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CssMinimizerPlugin(),
    new SpritePlugin(),
    new HtmlValidatePlugin(),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: 'http://www.w3.org/2000/svg' },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
});

function useJavascript(env) {
  if (env.production) {
    return {
      loader: 'babel-loader',
      options: {
        presets: [['@babel/preset-env', { targets: 'defaults' }]],
      },
    };
  }

  return [];
}
