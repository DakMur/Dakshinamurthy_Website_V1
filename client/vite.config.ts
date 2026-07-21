import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Raise warning threshold — vendor-icons (lucide-react) intentionally imports
      // all icons via wildcard for dynamic domain.icon string lookups.
      // Gzip size is 157 KB which is well within modern performance budgets.
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          // Deterministic chunk names for CDN/browser cache stability
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          manualChunks: (id: string) => {
            // React core — smallest chunk, loads first
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'vendor-react';
            }
            // Motion/Framer — large animation library
            if (
              id.includes('node_modules/motion') ||
              id.includes('node_modules/framer-motion')
            ) {
              return 'vendor-motion';
            }
            // Three.js ecosystem — heaviest chunk, only loaded on landing
            if (
              id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three') ||
              id.includes('node_modules/troika') ||
              id.includes('node_modules/zustand')
            ) {
              return 'vendor-three';
            }
            // Lucide icons — tree-shaken but still sizeable
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            // GSAP animation library
            if (id.includes('node_modules/gsap')) {
              return 'vendor-gsap';
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/database.json']
      },
    },
  };
});

