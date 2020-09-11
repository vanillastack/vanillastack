

module.exports = {
    pages: {
        index: {
            entry: 'src/frontend/vanilla.js',
            template: 'public/index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    runtimeCompiler: true,


  }