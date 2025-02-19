
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': process.env.NODE_ENV === 'development'
        ? 'http://localhost:5003'
        : 'https://ai-project-neon.vercel.app',
      '/translations': process.env.NODE_ENV === 'development'
        ? 'http://localhost:5003'
        : 'https://ai-project-neon.vercel.app',
    },
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
});
