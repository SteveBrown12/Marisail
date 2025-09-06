import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [
      'e57c-2a09-bac1-3680-1f0-00-2a8-62.ngrok-free.app',
      'test.marisail.com',
    ],
  },
  preview: {
    allowedHosts: ['test.marisail.com'], 
    port: 4173,
  },
});