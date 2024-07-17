export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://stardatabase-api-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
