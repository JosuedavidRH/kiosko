import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'], // soporta navegadores antiguos
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // para async/await
    }),
  ],
  build: {
    sourcemap: true, // 👈 esto habilita los source maps
  },
})
