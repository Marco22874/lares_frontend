/**
 * @file sanitize.js
 * @author Lares Cohousing Dev Team
 * @date 2026-02-11
 * @description Output sanitization utilities to prevent
 *              XSS attacks. Encodes HTML entities and
 *              strips dangerous content before rendering.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

/**
 * HTML entity map for encoding special characters.
 */
const HTML_ENTITIES =
{
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

/**
 * Pattern matching HTML special characters.
 */
const HTML_SPECIAL_CHARS = /[&<>"'`/]/g;

/**
 * @description Encodes HTML special characters to
 *              prevent XSS when rendering user input.
 * @param {string} str - Raw string to encode
 * @returns {string} HTML-safe encoded string
 * @update 2026-02-11
 */
export function encodeHTML(str)
{
  if (typeof str !== 'string')
  {
    return '';
  }

  return str.replace(
    HTML_SPECIAL_CHARS,
    (char) => HTML_ENTITIES[char] || char
  );
}

/**
 * @description Strips all HTML tags from a string.
 *              Used as an additional layer of defense
 *              for user-submitted content.
 * @param {string} str - String potentially containing
 *                       HTML tags
 * @returns {string} String with all tags removed
 * @update 2026-02-11
 */
export function stripHTML(str)
{
  if (typeof str !== 'string')
  {
    return '';
  }

  return str.replace(/<[^>]*>/g, '');
}

/**
 * @description Sanitizes a URL to prevent javascript:
 *              protocol and other dangerous schemes.
 *              Only allows http, https, mailto, and tel.
 * @param {string} url - URL to sanitize
 * @returns {string} Safe URL or empty string
 * @update 2026-02-11
 */
export function sanitizeUrl(url)
{
  if (typeof url !== 'string')
  {
    return '';
  }

  const trimmed = url.trim().toLowerCase();
  const allowedProtocols = [
    'http:',
    'https:',
    'mailto:',
    'tel:',
  ];

  try
  {
    const parsed = new URL(trimmed);
    if (allowedProtocols.includes(parsed.protocol))
    {
      return url.trim();
    }
    return '';
  }
  catch
  {
    if (trimmed.startsWith('/') || trimmed.startsWith('#'))
    {
      return url.trim();
    }
    return '';
  }
}

/**
 * @description Full sanitization pipeline for user
 *              input: strips HTML then encodes entities.
 * @param {string} str - Raw user input
 * @returns {string} Fully sanitized string
 * @update 2026-02-11
 */
export function sanitizeInput(str)
{
  return encodeHTML(stripHTML(str));
}
