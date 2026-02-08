import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@mini-apps/sdk': resolve(__dirname, '../../packages/sdk/src'),
    },
  },
  server: {
    port: 5180,
    open: true,
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
  },
});
