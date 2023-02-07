const path = require('path');
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    transpileDependencies: ['resize-detector'],
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 80,
        host: 'localhost',
        open: true,
        disableHostCheck: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                // target: 'http://112.74.44.67',
                target: 'http://c.boboxia.cc',
                // target: 'https://slb.boboxia.cc',
                // target: 'https://api-test.boboxia.cc',
                // target: 'http://192.168.110.197:12001', 
                // target: 'http://192.168.1.13:12003',
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
        }
    },
    configureWebpack:{
        resolve:{
          alias:{
            '@':path.resolve(__dirname, './src'),
            '@i':path.resolve(__dirname, './src/assets'),
          } 
        },
        plugins: [
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
          
          // 下面是下载的插件的配置
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
          }),
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 5, 
            minChunkSize: 100
          })
        ],
        // 不打包第三方库
        // externals: {
        //   vue: 'vue',
        //   vuex: 'Vuex',
        //   'vue-router': 'VueRouter',
        //   axios: 'axios',
        // }
      }
}
