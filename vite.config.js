export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://stardb-api.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
