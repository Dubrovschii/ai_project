
// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';
// import path from 'path';
// import svgLoader from 'vite-svg-loader';

// export default defineConfig({
//   plugins: [
//     vue(),
//     svgLoader(),
//   ],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   server: {
//     proxy: {
//       '/api': process.env.NODE_ENV === 'development'
//         ? 'http://localhost:5003'
//         : 'https://ai-project-neon.vercel.app',
//       '/translations': process.env.NODE_ENV === 'development'
//         ? 'http://localhost:5003'
//         : 'https://ai-project-neon.vercel.app',
//     },
//   },

//   build: {
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             if (id.includes('vuetify')) return 'vuetify';
//             if (id.includes('vue')) return 'vue-core';
//             if (id.includes('vue-router')) return 'vue-router';
//             if (id.includes('lodash')) return 'lodash';
//             return 'vendor';
//           }
//         },
//       },
//     },

//   },
// });
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
      '/api': {
        target: process.env.NODE_ENV === 'development'
          ? 'http://localhost:5003'
          : 'https://ai-project-neon.vercel.app',
        changeOrigin: true,
        secure: false,
      },
      '/translations': {
        target: process.env.NODE_ENV === 'development'
          ? 'http://localhost:5003'
          : 'https://ai-project-neon.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/translations/, '/translations'),
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vuetify')) return 'vuetify';
            if (id.includes('vue')) return 'vue-core';
            if (id.includes('vue-router')) return 'vue-router';
            if (id.includes('lodash')) return 'lodash';
            return 'vendor';
          }
        },
      },
    },
  },
});
