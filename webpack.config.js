const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProdEnv = process.env.NODE_ENV === 'production'

const extractStyles = new ExtractTextPlugin({
  filename: `react/styles.css`,
  allChunks: true,
  disable: !isProdEnv
})

const extraPlugins = []

if (isProdEnv) {
  extraPlugins.push(new HtmlWebpackPlugin({
    title: 'React Slider with HammerJS',
    template: './index.ejs',
    inject: false
  }))
}

module.exports = {
  context: path.resolve(__dirname, 'front'),
  entry: [
    './react/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'react/app.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)(\?.*)?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['es2015', { modules: false }], 'es2016', 'es2017', 'react']
          }
        }]
      },
      {
        test: /\.(css|scss)(\?.*)?$/,
        include: path.resolve(__dirname, 'front/react/'),
        use: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      }
    ]
  },
  plugins: [
    extractStyles,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' }
    ]),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    ...extraPlugins
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
}
