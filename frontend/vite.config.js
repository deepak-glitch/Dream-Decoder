import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/interpret': {
        target: process.env.REACT_APP_API_BASE,
        changeOrigin: true,
        secure: false
      },
      '/poem': {
        target: process.env.REACT_APP_API_BASE,
        changeOrigin: true,
        secure: false
      },
      '/visualize': {
        target: process.env.REACT_APP_API_BASE,
        changeOrigin: true,
        secure: false
      }
    }
  }
});