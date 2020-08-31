
const configureAPI = require('./src/configure.js')

module.exports = {
    pages: {
        index: {
            entry: 'src/frontend/vanilla.js',
            template: 'public/index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    devServer: {
        before: configureAPI
      },

    runtimeCompiler: true,


  }