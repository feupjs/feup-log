const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge'); // 合并webpack配置插件
const isProd = process.env.BUILD_ENV !== 'dev';
const configName = `./webpack.${isProd ? 'prod' : 'dev'}.js`;
const merge_Webpack_Config = require(`./${configName}`); // 动态加载webpack配置

const config = {
  BUILD_ENV: process.env.BUILD_ENV, // 打包环境
  DEBUG: process.env.DEBUG, // 是否是调试
};

const resolve = (dir) => {
  return path.resolve(__dirname, '../' + dir);
};

const webpackConfig = {
  entry: {
    // onlyForTest: './src/main/report.js',
    log: './src/main/index.ts',
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
    extensions: ['.ts', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: ['babel-loader'],
        // exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // new htmlPlugin({
    //   hash: true,
    //   template: './src/index.html',
    // }),
  ],
};

module.exports = merge(webpackConfig, merge_Webpack_Config(config));
