// webpack.config.js
const path = require('path');
// 修改引入HTML的js的名称
const htmlWebpaclPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development", // 开发模式
  entry: path.resolve(__dirname, "../src/main.js"), // 入口文件
  output: {
    filename: "[name].[hash:8].js", // 打包后的文件名称
    path: path.resolve(__dirname, "../dist") // 打包后的目录
  },
  plugins: [
    new htmlWebpaclPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    })
  ]
};
