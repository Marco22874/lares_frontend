/**
 * @file astro.config.mjs
 * @author Marco De Luca
 * @date 2026-02-11
 * @description Astro configuration for Lares Cohousing
 *              website. Static site generation with
 *              multilingual routing (IT, EN, DE, FR).
 */

// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig(
{
  output: 'static',
  site: 'https://larescohousing.it',
  i18n:
  {
    defaultLocale: 'it',
    locales: ['it', 'en', 'de', 'fr'],
    routing:
    {
      prefixDefaultLocale: true,
    },
  },
  build:
  {
    inlineStylesheets: 'auto',
  },
  vite:
  {
    build:
    {
      cssMinify: true,
    },
  },
});
