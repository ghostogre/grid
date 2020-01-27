// 使用postcss添加浏览器前置
module.exports = {
  plugins: [require('autoprefixer')]  // 引用该插件即可了
}

// webpack.config.js 里直接配置
// rules:[{
//   test:/\.less$/,
//   use:['style-loader','css-loader',{
//       loader:'postcss-loader',
//       options:{
//           plugins:[require('autoprefixer')]
//       }
//   },'less-loader'] // 从右向左解析原则
// }]
