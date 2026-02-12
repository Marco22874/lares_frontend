/**
 * @file sanitize.test.js
 * @author Marco De Luca
 * @date 2026-02-11
 * @description Unit tests for output sanitization
 *              module. Tests HTML encoding, tag
 *              stripping, and URL sanitization.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

import { describe, it, expect } from 'vitest';
import
{
  encodeHTML,
  stripHTML,
  sanitizeUrl,
  sanitizeInput,
} from '../../src/lib/sanitize.js';

describe('encodeHTML', () =>
{
  it('encodes angle brackets', () =>
  {
    expect(encodeHTML('<div>')).toBe(
      '&lt;div&gt;'
    );
  });

  it('encodes ampersand', () =>
  {
    expect(encodeHTML('a&b')).toBe('a&amp;b');
  });

  it('encodes quotes', () =>
  {
    expect(encodeHTML('"hello"')).toBe(
      '&quot;hello&quot;'
    );
  });

  it('encodes single quotes', () =>
  {
    expect(encodeHTML("it's")).toBe(
      'it&#x27;s'
    );
  });

  it('encodes script tag', () =>
  {
    const input = '<script>alert(1)</script>';
    const encoded = encodeHTML(input);
    expect(encoded).not.toContain('<script>');
    expect(encoded).toContain('&lt;script&gt;');
  });

  it('handles non-string input', () =>
  {
    expect(encodeHTML(null)).toBe('');
    expect(encodeHTML(undefined)).toBe('');
    expect(encodeHTML(123)).toBe('');
  });

  it('preserves safe text', () =>
  {
    expect(encodeHTML('Hello World')).toBe(
      'Hello World'
    );
  });
});

describe('stripHTML', () =>
{
  it('removes HTML tags', () =>
  {
    expect(
      stripHTML('<b>bold</b>')
    ).toBe('bold');
  });

  it('removes script tags', () =>
  {
    const input = '<script>alert(1)</script>text';
    expect(stripHTML(input)).toBe('alert(1)text');
  });

  it('handles nested tags', () =>
  {
    const input = '<div><p>text</p></div>';
    expect(stripHTML(input)).toBe('text');
  });

  it('handles non-string input', () =>
  {
    expect(stripHTML(null)).toBe('');
  });
});

describe('sanitizeUrl', () =>
{
  it('allows https URLs', () =>
  {
    const url = 'https://example.com';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('allows http URLs', () =>
  {
    const url = 'http://example.com';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('allows mailto links', () =>
  {
    const url = 'mailto:test@example.com';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('allows tel links', () =>
  {
    const url = 'tel:+39123456789';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('blocks javascript: protocol', () =>
  {
    expect(
      sanitizeUrl('javascript:alert(1)')
    ).toBe('');
  });

  it('blocks data: protocol', () =>
  {
    expect(
      sanitizeUrl('data:text/html,<script>')
    ).toBe('');
  });

  it('allows relative paths', () =>
  {
    expect(sanitizeUrl('/about')).toBe('/about');
  });

  it('allows hash links', () =>
  {
    expect(sanitizeUrl('#section')).toBe(
      '#section'
    );
  });

  it('handles non-string input', () =>
  {
    expect(sanitizeUrl(null)).toBe('');
  });
});

describe('sanitizeInput', () =>
{
  it('strips HTML and encodes', () =>
  {
    const input = '<b>bold</b> & "quotes"';
    const result = sanitizeInput(input);
    expect(result).not.toContain('<b>');
    expect(result).toContain('&amp;');
    expect(result).toContain('&quot;');
  });

  it('neutralizes XSS payload', () =>
  {
    const xss =
      '<img src=x onerror=alert(1)>test';
    const result = sanitizeInput(xss);
    expect(result).not.toContain('<img');
    expect(result).not.toContain('onerror');
    expect(result).toContain('test');
  });
});
