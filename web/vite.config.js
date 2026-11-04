import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In the Base44 sandbox the preview proxy forwards the public hostname to the
// dev server, so that host has to be allowed. Vite >= 6.1 also picks up
// __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS from the environment on its own; this
// is a narrow fallback that only applies when the sandbox flag is set.
const allowedHosts = [];
if (process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_SANDBOX_HOST_DOMAIN) {
  allowedHosts.push(`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`);
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts,
    watch: { usePolling: true, interval: 400 },
    proxy: {
      '/api': {
        target: process.env.API_TARGET || 'http://api:8000',
        changeOrigin: true,
      },
    },
  },
});
