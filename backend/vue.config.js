

module.exports = {
    pages: {
        index: {
            entry: 'src/frontend/vanilla.js',
            template: 'src/frontend/index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    runtimeCompiler: true,


  }