import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  build: {
    rolldownOptions: {
      output: {
        // Separa o núcleo React (necessário no boot) e o Recharts (só Dashboard) em chunks
        // estáveis, melhorando o cache entre deploys. FullCalendar e libs de formulário
        // NÃO entram aqui de propósito: agrupá-los manualmente faz o Vite pré-carregá-los
        // no index.html (modulepreload), anulando o lazy loading por rota.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'vendor-react';
          }
          if (id.includes('recharts') || /node_modules\/(d3-|victory-vendor|internmap)/.test(id)) {
            return 'vendor-recharts';
          }
          return undefined;
        },
      },
    },
  },
})
