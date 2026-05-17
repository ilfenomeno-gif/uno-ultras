import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals:     true,
    environment: 'jsdom',
    coverage:    { provider: 'v8', reporter: ['text', 'html'] },
    alias: {
      '@core':        resolve(__dirname, 'src/core'),
      '@ai':          resolve(__dirname, 'src/ai'),
      '@progression': resolve(__dirname, 'src/progression'),
      '@multiplayer': resolve(__dirname, 'src/multiplayer'),
      '@settings':    resolve(__dirname, 'src/settings'),
      '@utils':       resolve(__dirname, 'src/utils'),
    },
  },
});
