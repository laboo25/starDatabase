export default {
  server: {
    proxy: {
      '/api': {
        target: 'star-database-api.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
