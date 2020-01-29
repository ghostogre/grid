const path = require("path");
const webpackConfig = require("./webpack.config.js");
const WebpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = WebpackMerge(webpackConfig, {
  mode: "production",
  devtool: "cheap-module-source-map",
  plugins: [
    new CopyWebpackPlugin( // 拷贝文件
    [
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, "../dist")
      }, 
      // {
      //   ignore: [],
      //   copyUnmodified: true
      // }
    ])
  ],
  optimization: { // 优化
    minimizer: [
      new UglifyJsPlugin({
        // 压缩js
        cache: true, // 启用文件缓存
        parallel: true, // 多进程并行运行来提高构建速度
        sourceMap: true // 使用sourceMap将错误消息位置映射到模块(这会减慢编译速度)
      }),
      // 优化或者压缩CSS资源
      new OptimizeCssAssetsPlugin({
        // assetNameRegExp：匹配用表达式
        // cssProcessor: 优化用的CSS处理器
        // canPrint: 默认true，在console中打印
      })
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
});
