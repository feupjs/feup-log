const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = function (config) {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].min.js',
      library: 'fig', // 全局变量
      libraryTarget: 'umd',
    },
    devServer: {
      contentBase: path.resolve(__dirname, '../dist'),
      disableHostCheck: true,
      compress: true,
      port: 3200,
      proxy: {
        '/v1': {
          // 代理api
          target: 'https://xxx.com', // 服务器api地址
          changeOrigin: true, // 是否跨域
          secure: true,
          // ws: true, // proxy websockets
          pathRewrite: {
            // 重写路径
            // '^/v1': '',
          },
        },
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.NamedModulesPlugin(), // 在控制台中输出可读的模块名
    ],
    performance: {
      hints: false,
    },
  };
};
