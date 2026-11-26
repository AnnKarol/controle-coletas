import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Configuração dos testes automatizados (npm test)
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
