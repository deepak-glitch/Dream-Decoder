import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babyGif from "@/assets/image2.gif";
import cloudPng from "@/assets/cloudmain.png";
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});