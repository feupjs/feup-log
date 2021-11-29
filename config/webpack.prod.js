const webpack = require('webpack');
const path = require('path');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 自动清除dist目录
const TerserPlugin = require('terser-webpack-plugin');
const resolve = (dir) => {
  return path.resolve(__dirname, '../' + dir);
};

module.exports = function (config) {
  const { BUILD_ENV, DEBUG } = config;
  const isBuildWin = BUILD_ENV === 'win'; // 打包是否挂载win对象

  return {
    mode: 'production',
    devtool: 'none',
    target: isBuildWin ? 'web' : 'node',
    output: {
      // 直接挂载cdn的打包挂载win对象上，常规打包使用commonjs
      path: resolve(`dist${isBuildWin ? '/cdn' : ''}`),
      filename: isBuildWin ? '[name].min.js' : '[name].js',
      library: isBuildWin ? 'fig' : '',
      libraryTarget: isBuildWin ? 'umd' : 'commonjs',
    },
    optimization: {
      namedModules: true, // 可读模块标识符以获得更好的调试
      moduleIds: 'hashed', // 指定算法，hash更好的长期缓存ID
      splitChunks: {
        chunks: 'async', // 异步加载代码块
        name: true,
      },
      nodeEnv: 'production',
      sideEffects: true,
      concatenateModules: true,
      minimize: true,
      ...(DEBUG
        ? {}
        : {
            minimizer: [
              // 压缩js
              new TerserPlugin({
                cache: true,
                parallel: true,
                extractComments: false, // 移除license文件
                terserOptions: {
                  compress: {
                    comparisons: false, // 关闭二进制优化
                    drop_console: true,
                  },
                  parse: {},
                  mangle: true,
                  output: {
                    comments: false,
                    beautify: false,
                    ascii_only: true, // 非ASCII字符转换为UTF-8
                  },
                },
                parallel: true, // 多线程
                cache: true,
                sourceMap: true,
              }),
            ],
          }),
    },
    plugins: [],
  };
};
