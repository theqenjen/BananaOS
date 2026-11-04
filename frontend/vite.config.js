import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // The sandbox preview is proxied over HTTPS on port 443 of a rotating host.
    allowedHosts: previewMode ? [`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`] : [],
    hmr: previewMode ? { protocol: 'wss', clientPort: 443 } : undefined,
    proxy: {
      '/api': {
        target: 'http://api:8000',
        changeOrigin: true,
      },
    },
  },
});
