const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Atelier Cadre | Bespoke Custom Photo Frames'
    }
  }
})
