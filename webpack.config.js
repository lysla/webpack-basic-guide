const path = require('path');
const webpack = require('webpack');
// Plugin per l'estrazione separata del file .css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Plugin per la minificazione e ottimizzazione del file .js
const TerserJSPlugin = require('terser-webpack-plugin');
// Plugin per la minificazione e ottimizzazione del file .css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// Plugin che rimuove il css non utilizzato
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = (env, argv) => {
  return {
    // File Javascript di entrata pre-compilato
    entry: './src/index.js',
    // Cartella di output per i file compilati e nome del file Javascript
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
      filename: 'app.js',
    },
    // Configurazione di sviluppo per l'Hot Module Replacement
    devtool: 'source-map',
    devServer: {
      contentBase: './',
      publicPath: '/dist/',
      hot: true,
      watchContentBase: true
    },
    module: {
      rules: [
        // Loaders per i file di tipo CSS e SCSS
        {
          test: /\.(sa|sc|pc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        // Loader per i file risorse, come immagini e font, inclusi all'interno del CSS, SCSS o Javascript. Quando il file pesa meno del limite indicato viene automaticamente generato un data base64, altrimenti la risorsa viene impacchettata e spostata nella cartella di output
        {
          test: /\.(jpg|jpeg|gif|png|woff|woff2|eot|ttf|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[ext]?v=[contenthash]'
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
      // Inizializzazione del plugin per rimuovere i css inutilizzati
      argv.mode === 'production' ? new PurgecssPlugin({
        paths: require('glob').sync(`./../Views/**/*`, { nodir: true }),
        variables: true,
        safelist: {
          deep: [
            /slick/,
            /show/,
            /sticky/,
            /cc/,
          ],
        },
      }) : function () { return false },
      // Globalizzazione del plugin jQuery
      new webpack.ProvidePlugin({
        $: 'jquery'
      })
    ]
  }
};
