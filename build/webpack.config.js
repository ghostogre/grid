// webpack.config.js
const path = require('path');
// 修改引入HTML的js的名称
const htmlWebpaclPlugin = require("html-webpack-plugin");
// 清除上次的编译
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// css 分割，4.0以前用extract-text-webpack-plugin
// 这个插件应该只用在 production 配置中，并且在loaders链中不使用 style-loader
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 这里的包如果没有安装就会出现提示webpack not installed。
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const devMode = process.argv.indexOf("--mode=production") === -1

module.exports = {
  mode: "development", // 开发模式
  // entry: path.resolve(__dirname, "../src/main.js"), // 单入口文件
  // entry: {
  //   main: path.resolve(__dirname, "../src/main.js")
  // }, // 多入口文件
  devServer: {
    port: 3000,
    hot: true,
    contentBase: path.resolve(__dirname, '../dist')
  },
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, "../src/main.js")
  ],
  output: {
    filename: "[name].[hash:8].js", // 打包后的文件名称
    path: path.resolve(__dirname, "../dist") // 打包后的目录
  },
  plugins: [
    new htmlWebpaclPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      chunks: ['main'] // 与入口文件对应的模块名
    }),
    new MiniCssExtractPlugin({
      // [id]和[name]在webpack中被称做placeholder。
      // 用来在webpack构建之后动态得替换内容的（本质上是正则替换）
      // filename比较简单就是根据entry中的名字来命名，是静态的。
      // chunkFilename是构建应用的时候生成的
      filename: '[name].[hash:8].css',
      // chunkFilename用来打包require.ensure方法中引入的模块
      // 告诉webapck如何处理非entry模块(有的文件不是在entry上的)，非entry的只能使用id
      // id在打包后的文件里
      chunkFilename: '[id].css'
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css/,
        // style-loader会添加到style标签里，这里是打包到单个文件
        use: [
          {
            loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: devMode
            }
          },
          "css-loader",
          "postcss-loader"
        ] // 从右向左解析原则
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              // url-loader 一般与file-loader搭配使用，功能与 file-loader 类似，如果文件小于限制的大小。
              // 则会返回 base64 编码，否则使用 file-loader 将文件移动到输出的目录中
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash8].[ext]'
              }
            }
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        }
      }
    ]
  },
  resolve: {
    alias: { // 配置模块如何解析
      "vue$": "vue/dist/vue.runtime.esm.js",
      " @": path.resolve(__dirname, '../src') // @挂载到src路径下
    },
    extensions: ["*", ".js", ".json", ".vue"]
  }
};
