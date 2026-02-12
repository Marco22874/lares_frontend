/**
 * @file vitest.config.js
 * @author Marco De Luca
 * @date 2026-02-11
 * @description Vitest configuration for unit and
 *              integration tests.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig(
{
  test:
  {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{js,ts}'],
    coverage:
    {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**'],
    },
  },
});
