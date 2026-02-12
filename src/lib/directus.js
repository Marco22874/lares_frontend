/**
 * @file directus.js
 * @author Marco De Luca
 * @date 2026-02-11
 * @description Directus REST API client for fetching
 *              multilingual content at build time.
 *              Provides functions to query collections
 *              with translation support.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

const DIRECTUS_URL =
  import.meta.env.PUBLIC_DIRECTUS_URL ||
  'http://localhost:8055';

const DEFAULT_LOCALE =
  import.meta.env.PUBLIC_DEFAULT_LOCALE || 'it';

const SUPPORTED_LOCALES = ['it', 'en', 'de', 'fr'];

/**
 * @description Fetches data from Directus REST API.
 *              Handles errors and returns parsed JSON.
 * @param {string} endpoint - API endpoint path
 * @param {object} params - Query parameters
 * @returns {Promise<object>} Parsed API response
 * @throws {Error} On network or API errors
 * @update 2026-02-11
 */
async function fetchDirectus(endpoint, params = {})
{
  const url = new URL(
    `/items/${endpoint}`,
    DIRECTUS_URL
  );

  for (const [key, value] of Object.entries(params))
  {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(),
  {
    headers:
    {
      'Accept': 'application/json',
    },
  });

  if (!response.ok)
  {
    throw new Error(
      `Directus API error: ${response.status} ` +
      `${response.statusText} for ${endpoint}`
    );
  }

  const json = await response.json();
  return json.data;
}

/**
 * @description Fetches a collection with translations
 *              filtered by locale.
 * @param {string} collection - Collection name
 * @param {string} locale - Language code (it|en|de|fr)
 * @param {object} extraParams - Additional query params
 * @returns {Promise<Array>} Translated items
 * @update 2026-02-11
 */
export async function getCollection(
  collection,
  locale = DEFAULT_LOCALE,
  extraParams = {}
)
{
  const validLocale = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;

  const params =
  {
    'deep[translations][_filter][languages_code][_eq]':
      validLocale,
    'fields': '*,translations.*',
    ...extraParams,
  };

  return fetchDirectus(collection, params);
}

/**
 * @description Fetches a single item by slug with
 *              translations for the given locale.
 * @param {string} collection - Collection name
 * @param {string} slug - Item slug
 * @param {string} locale - Language code (it|en|de|fr)
 * @returns {Promise<object|null>} Translated item
 * @update 2026-02-11
 */
export async function getItemBySlug(
  collection,
  slug,
  locale = DEFAULT_LOCALE
)
{
  const validLocale = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;

  const params =
  {
    'filter[slug][_eq]': slug,
    'deep[translations][_filter][languages_code][_eq]':
      validLocale,
    'fields': '*,translations.*',
    'limit': 1,
  };

  const items = await fetchDirectus(
    collection,
    params
  );

  return items?.length > 0 ? items[0] : null;
}

/**
 * @description Fetches site-wide settings with
 *              translations for the given locale.
 * @param {string} locale - Language code (it|en|de|fr)
 * @returns {Promise<object>} Site settings
 * @update 2026-02-11
 */
export async function getSiteSettings(
  locale = DEFAULT_LOCALE
)
{
  const validLocale = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;

  const params =
  {
    'deep[translations][_filter][languages_code][_eq]':
      validLocale,
    'fields': '*,translations.*',
  };

  return fetchDirectus('site_settings', params);
}

/**
 * @description Returns the Directus asset URL for a
 *              given file ID with optional transforms.
 * @param {string} fileId - Directus file UUID
 * @param {object} transforms - Image transforms
 * @returns {string} Full asset URL
 * @update 2026-02-11
 */
export function getAssetUrl(fileId, transforms = {})
{
  if (!fileId)
  {
    return '';
  }

  const url = new URL(
    `/assets/${fileId}`,
    DIRECTUS_URL
  );

  for (const [key, value] of Object.entries(transforms))
  {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/**
 * @description Submits the contact form data to the
 *              custom Directus endpoint.
 * @param {object} formData - Validated form data
 * @returns {Promise<object>} Submission result
 * @throws {Error} On validation or server errors
 * @update 2026-02-11
 */
export async function submitContactForm(formData)
{
  const url = new URL(
    '/contact-form',
    DIRECTUS_URL
  );

  const response = await fetch(url.toString(),
  {
    method: 'POST',
    headers:
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok)
  {
    const error = await response.json()
      .catch(() => ({}));
    throw new Error(
      error.message || 'Contact form submission failed'
    );
  }

  return response.json();
}

export { DIRECTUS_URL, SUPPORTED_LOCALES };
