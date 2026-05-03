/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Efficiency: Manual code-splitting for optimal bundle sizes ────────────────
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/gsap')) return 'animation';
          if (id.includes('node_modules/leaflet')) return 'map';
          if (id.includes('node_modules/firebase')) return 'firebase';
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },

  // ── Testing: Vitest configuration (both setup files) ─────────────────────────
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/tests/setup.ts',   // component mocks (matchMedia, canvas, etc.)
      './src/test-setup.ts',    // jest-dom matchers
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/**/*.test.*',
        'src/test-setup.ts',
        'src/tests/setup.ts',
      ],
    },
  },

  optimizeDeps: {
    include: ['three', 'firebase/app', 'firebase/analytics', 'firebase/performance'],
  },

  define: {
    global: 'globalThis',
  },
});
