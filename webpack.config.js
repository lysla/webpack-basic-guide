const path = require('path');
const webpack = require('webpack');
// Plugin per l'estrazione separata del file .css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Plugin per la minificazione e ottimizzazione del file .js
const TerserJSPlugin = require('terser-webpack-plugin');
// Plugin per la minificazione e ottimizzazione del file .css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // File Javascript di entrata pre-compilato
  entry: './src/index.js',
  // Cartella di output per i file compilati e nome del file Javascript
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      // Loaders per i file di tipo CSS e SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
      // Loader per i file risorse, come immagini e font, inclusi all'interno del CSS, SCSS o Javascript. Quando il file pesa meno del limite indicato viene automaticamente generato un data base64, altrimenti la risorsa viene impacchettata e spostata nella cartella di output
      {
        test: /\.(jpg|jpeg|gif|png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      },
      // Loader e configurazione di Babel per il transpiling
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  // Assegnazione dei plugin di minificazione e ottimizzazione
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    // Nome del file di output .css
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    // Globalizzazione del plugin jQuery
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
};