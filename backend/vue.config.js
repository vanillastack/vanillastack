module.exports = {
    pages: {
        index: {
            entry: 'src/frontend/vanilla.js',
            template: 'src/public/index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    runtimeCompiler: true
  }