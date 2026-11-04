import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { browserProxy } from './server/browserProxy.js'
import { callApi } from './server/callApi.js'

// The sandbox preview proxy forwards requests to the sandbox hostname, which
// rotates between environments. Only widen the host allowlist while running
// inside the Base44 sandbox; ordinary local development keeps Vite defaults.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1'
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN

export default defineConfig({
  plugins: [react(), browserProxy(), callApi()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts:
      previewMode && sandboxHostDomain ? [`.${sandboxHostDomain}`] : undefined,
    hmr: previewMode ? { protocol: 'wss', clientPort: 443 } : undefined,
    // Bind mounts in the sandbox do not always deliver inotify events.
    watch: previewMode ? { usePolling: true, interval: 300 } : undefined,
  },
})
