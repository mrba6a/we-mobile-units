import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'we_review',
      filename: 'remoteEntry.js',
      exposes: {
        './ReconciliationEngine': './src/components/ReconciliationEngine',
        './FinanceExplorer': './src/components/FinanceExplorer',
        './MonthlyReports': './src/components/MonthlyReports',
        './HistoricalEngine': './src/components/HistoricalEngine',
        './MasterPreview': './src/components/MasterPreview',
        './ReviewRoutes': './src/routes',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'zustand', 'recharts'],
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
    port: 3001,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});