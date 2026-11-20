import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'we_emp',
      filename: 'remoteEntry.js',
      exposes: {
        './EmpRoutes': './src/routes',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'zustand'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@we/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true,
    },
  },
  server: {
    port: 3002,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});