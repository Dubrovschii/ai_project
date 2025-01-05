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
      '@': path.resolve(__dirname, './src'),  // Алиас указывает на папку src
    },
  },
  server: {
    proxy: {
      '/api': process.env.NODE_ENV === 'development'
        ? 'http://localhost:5003'  // Локальный сервер для разработки
        : 'https://ai-project-neon.vercel.app',  // Продакшн сервер
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
