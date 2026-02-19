/**
 * @file eslint.config.js
 * @author Marco De Luca
 * @date 2026-02-19
 * @description ESLint flat config for Astro + JS.
 *              Uses ESLint 9 flat config format.
 */

import js from '@eslint/js';
import globals from 'globals';
import eslintPluginAstro
  from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions:
    {
      globals:
      {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules:
    {
      'no-unused-vars': ['warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-useless-escape': 'warn',
    },
  },
  {
    ignores:
    [
      'dist/**',
      'node_modules/**',
      '.astro/**',
    ],
  },
];
