import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    port: 5174,
    open: true
  },
  test: {
    include: ['tests/*.test.ts'],
    environment: 'node'
  }
});