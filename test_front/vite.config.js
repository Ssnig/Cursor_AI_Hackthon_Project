import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@backend': path.resolve(__dirname, '../Backend/src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Avoid browser CORS when calling local n8n webhooks.
      '/api/n8n': {
        target: 'http://127.0.0.1:5678',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/n8n/, ''),
      },
    },
  },
});
