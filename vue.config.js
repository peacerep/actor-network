const { defineConfig } = require('@vue/cli-service')

module.exports = {
  // publicPath: '/'
  publicPath: process.env.NODE_ENV === 'production' ? '/actor-network/' : '/'
}
