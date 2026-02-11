/**
 * @file validation.test.js
 * @author Lares Cohousing Dev Team
 * @date 2026-02-11
 * @description Unit tests for input validation module.
 *              Tests whitelist patterns for contact
 *              form fields against valid and malicious
 *              input (XSS, SQL injection).
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

import { describe, it, expect } from 'vitest';
import
{
  validateField,
  validateContactForm,
} from '../../src/lib/validation.js';

describe('validateField', () =>
{
  describe('name field', () =>
  {
    it('accepts valid names', () =>
    {
      const result = validateField('name', 'Marco');
      expect(result.valid).toBe(true);
    });

    it('accepts names with accents', () =>
    {
      const result = validateField(
        'name', 'François Müller'
      );
      expect(result.valid).toBe(true);
    });

    it('accepts names with apostrophe', () =>
    {
      const result = validateField(
        'name', "O'Brien"
      );
      expect(result.valid).toBe(true);
    });

    it('rejects names with numbers', () =>
    {
      const result = validateField(
        'name', 'Marco123'
      );
      expect(result.valid).toBe(false);
    });

    it('rejects XSS in name', () =>
    {
      const result = validateField(
        'name', '<script>alert(1)</script>'
      );
      expect(result.valid).toBe(false);
    });

    it('rejects SQL injection in name', () =>
    {
      const result = validateField(
        'name', "'; DROP TABLE users;--"
      );
      expect(result.valid).toBe(false);
    });

    it('rejects too short name', () =>
    {
      const result = validateField('name', 'A');
      expect(result.valid).toBe(false);
    });

    it('rejects too long name', () =>
    {
      const long = 'A'.repeat(101);
      const result = validateField('name', long);
      expect(result.valid).toBe(false);
    });
  });

  describe('email field', () =>
  {
    it('accepts valid email', () =>
    {
      const result = validateField(
        'email', 'user@example.com'
      );
      expect(result.valid).toBe(true);
    });

    it('rejects email without @', () =>
    {
      const result = validateField(
        'email', 'userexample.com'
      );
      expect(result.valid).toBe(false);
    });

    it('rejects XSS in email', () =>
    {
      const result = validateField(
        'email', '<script>@evil.com'
      );
      expect(result.valid).toBe(false);
    });

    it('rejects SQL injection in email', () =>
    {
      const result = validateField(
        'email', "admin'--@evil.com"
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('phone field', () =>
  {
    it('accepts valid phone', () =>
    {
      const result = validateField(
        'phone', '+39 06 1234567'
      );
      expect(result.valid).toBe(true);
    });

    it('accepts empty phone', () =>
    {
      const result = validateField('phone', '');
      expect(result.valid).toBe(true);
    });

    it('rejects letters in phone', () =>
    {
      const result = validateField(
        'phone', 'abc123'
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('subject field', () =>
  {
    it('accepts whitelisted subject', () =>
    {
      const result = validateField(
        'subject', 'info'
      );
      expect(result.valid).toBe(true);
    });

    it('rejects non-whitelisted subject', () =>
    {
      const result = validateField(
        'subject', 'hacking'
      );
      expect(result.valid).toBe(false);
    });

    it('rejects XSS in subject', () =>
    {
      const result = validateField(
        'subject', '<img onerror=alert(1)>'
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('message field', () =>
  {
    it('accepts valid message', () =>
    {
      const msg = 'Hello, I want information.';
      const result = validateField('message', msg);
      expect(result.valid).toBe(true);
    });

    it('rejects too short message', () =>
    {
      const result = validateField(
        'message', 'Hi'
      );
      expect(result.valid).toBe(false);
    });

    it('rejects too long message', () =>
    {
      const long = 'A'.repeat(2001);
      const result = validateField('message', long);
      expect(result.valid).toBe(false);
    });
  });

  describe('type safety', () =>
  {
    it('rejects non-string values', () =>
    {
      const result = validateField('name', 123);
      expect(result.valid).toBe(false);
    });

    it('rejects null values', () =>
    {
      const result = validateField('name', null);
      expect(result.valid).toBe(false);
    });

    it('rejects unknown fields', () =>
    {
      const result = validateField(
        'unknown', 'value'
      );
      expect(result.valid).toBe(false);
    });
  });
});

describe('validateContactForm', () =>
{
  const validData =
  {
    name: 'Marco Rossi',
    email: 'marco@example.com',
    phone: '+39 123456789',
    subject: 'info',
    message: 'I want more information about cohousing.',
  };

  it('validates correct form data', () =>
  {
    const result = validateContactForm(validData);
    expect(result.valid).toBe(true);
    expect(
      Object.keys(result.errors).length
    ).toBe(0);
  });

  it('detects missing required fields', () =>
  {
    const result = validateContactForm({});
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.subject).toBeDefined();
    expect(result.errors.message).toBeDefined();
  });

  it('detects honeypot bot', () =>
  {
    const data =
    {
      ...validData,
      honeypot: 'spam content',
    };
    const result = validateContactForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors._bot).toBeDefined();
  });

  it('allows optional phone to be empty', () =>
  {
    const data = { ...validData, phone: '' };
    const result = validateContactForm(data);
    expect(result.valid).toBe(true);
  });
});
