const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const entry = {
  main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true', './public/js/scripts.js']
};

const extractSass =  new ExtractTextPlugin({filename: "main.bundle.css"});

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
   filename: "./index.html"
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
 new webpack.HotModuleReplacementPlugin()
 /*new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  reportFilename: __dirname + '/bundleAnalyzerReport.html'
}),
*/
];


const moduleConfig = {
 entry,
 /*output: {
   path: path.resolve(__dirname, "public"),
   filename: "main.mjs",
   publicPath: path.resolve(__dirname, "public")
 },
 */
output: {
  path: path.join(__dirname, 'dist'),
  publicPath: '/',
  filename: '[name].mjs'
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


//module.exports = [legacyConfig, moduleConfig];
module.exports = moduleConfig
