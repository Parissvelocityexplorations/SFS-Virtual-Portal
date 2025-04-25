import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  optimizeDeps: {
    exclude: ["axios"]
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // Fail if port is already in use
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://api:80',  // Updated to use the Docker service name
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          console.log('🔧 VITE CONFIG - Proxy initialized for /api -> http://api:80');
          
          proxy.on('error', (err, _req, _res) => {
            console.log('🔥 PROXY ERROR:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🚀 PROXY REQUEST:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ PROXY RESPONSE:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
});
