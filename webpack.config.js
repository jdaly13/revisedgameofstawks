const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const entry = {
 main: "./public/js/scripts.js"
};

const extractSass =  new ExtractTextPlugin({filename: "[name].bundle.css"});

const cssRule = {
  test: /\.scss$/,
  include: [
    path.resolve(process.cwd(), 'public', 'scss')
  ],
  use: extractSass.extract({
    use: [{
        loader: "css-loader", options: {minimize: true}
    }, {
        loader: "sass-loader"
    }],
    fallback: "style-loader"
  })
};

const plugins = [
 extractSass,
 new HtmlWebpackPlugin({
   template: "./public/templates/index.html",
   filename: "index.html"
  }),
 new ScriptExtHtmlWebpackPlugin({
   module: /\.mjs$/,
   custom: [
     {
       test: /\.js$/,
       attribute: 'nomodule',
       value: ''
    },
   ]
 }),
 /*new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  reportFilename: __dirname + '/bundleAnalyzerReport.html'
}),
*/
];

const legacyConfig = {
  entry,
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-react", {
              useBuiltIns: "usage",
              targets: {
                esmodules: false
              },
            }],
          ],
        },
      },
      cssRule
    ]
  },
  plugins,
  mode: "development"
 }

const moduleConfig = {
 entry,
 output: {
   path: path.resolve(__dirname, "public"),
   filename: "[name].mjs"
 },
 module: {
   rules: [
     {
       test: /\.js$/,
       exclude: /node_modules/,
       loader: "babel-loader",
       options: {
         presets: [
           ["@babel/preset-react", {
             useBuiltIns: "usage",
             targets: {
               esmodules: true
             },
           }],
         ],
       },
     },
     cssRule
   ]
 },
 plugins,
 mode: "development"
}


module.exports = [
  legacyConfig, moduleConfig      
 ];
