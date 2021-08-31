const path = require('path');
const webpack = require('webpack');
// Plugin per l'estrazione separata del file .css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Plugin per la minificazione e ottimizzazione del file .js
const TerserJSPlugin = require('terser-webpack-plugin');
// Plugin per la minificazione e ottimizzazione del file .css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// Plugin che rimuove il css non utilizzato
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = (env, argv) => {
  return {
    // File Javascript di entrata pre-compilato
    entry: './src/index.js',
    // Cartella di output per i file compilati e nome del file Javascript
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js',
      clean: true,
      assetModuleFilename: '[hash][ext][query]',
    },
    // Configurazione di sviluppo per l'Hot Module Replacement
    devtool: 'source-map',
    devServer: {
      static: './',
      devMiddleware: {
        publicPath: "/dist/"
      },
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
        // Risorse assets
        {
          test: /\.(jpg|jpeg|gif|png|woff|woff2|eot|ttf|svg)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8192
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
      minimize: true,
      minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin({})]
    },
    plugins: [
      // Nome del file di output .css
      new MiniCssExtractPlugin({
        filename: 'app.css'
      }),
      // Inizializzazione del plugin per rimuovere i css inutilizzati
      argv.mode === 'production' ? new PurgecssPlugin({
        paths: require('glob').sync(`./*.html`, { nodir: true }),
        //paths: require("glob-all").sync(['./Pages/**/*', './Controls/**/*', './*.{aspx,master}'], { nodir: true }),
        variables: true,
        safelist: {
          deep: [
            /slick/,
            /show/,
            /sticky/,
            /zoom/,
            /cc/,
            /hamburger/,
            /fancy/,
            /loaded/,
            /active/,
            /open/
          ],
        },
      }) : function () { return false },
      // Globalizzazione del plugin jQuery
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  }
};
