/**
 * @file validation.js
 * @author Lares Cohousing Dev Team
 * @date 2026-02-11
 * @description Input validation using whitelist approach.
 *              All values must match allowed patterns;
 *              anything not explicitly permitted is
 *              rejected. Prevents XSS and SQL injection.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

/**
 * Whitelist patterns for contact form fields.
 * Only characters matching these patterns are accepted.
 */
const ALLOWED_PATTERNS =
{
  name: /^[a-zA-ZÀ-ÿ\s'\-]{2,100}$/,
  email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\d\s+\-()]{0,20}$/,
  message: /^[\s\S]{10,2000}$/,
};

/**
 * Whitelist of allowed subject values.
 * Any subject not in this list is rejected.
 */
const ALLOWED_SUBJECTS = [
  'info',
  'visit',
  'partnership',
  'other',
];

/**
 * Maximum lengths for each field.
 */
const MAX_LENGTHS =
{
  name: 100,
  email: 254,
  phone: 20,
  subject: 20,
  message: 2000,
};

/**
 * @description Validates a single field value against
 *              its whitelist pattern.
 * @param {string} field - Field name
 * @param {string} value - Field value to validate
 * @returns {object} { valid: boolean, error: string }
 * @update 2026-02-11
 */
export function validateField(field, value)
{
  if (typeof value !== 'string')
  {
    return {
      valid: false,
      error: `${field}: must be a string`,
    };
  }

  const trimmed = value.trim();
  const maxLen = MAX_LENGTHS[field];

  if (maxLen && trimmed.length > maxLen)
  {
    return {
      valid: false,
      error: `${field}: exceeds max length ${maxLen}`,
    };
  }

  switch (field)
  {
    case 'name':
    case 'email':
    case 'phone':
    case 'message':
    {
      const pattern = ALLOWED_PATTERNS[field];
      if (!pattern.test(trimmed))
      {
        return {
          valid: false,
          error: `${field}: contains invalid characters`,
        };
      }
      return { valid: true, error: '' };
    }

    case 'subject':
    {
      if (!ALLOWED_SUBJECTS.includes(trimmed))
      {
        return {
          valid: false,
          error: `${field}: invalid subject value`,
        };
      }
      return { valid: true, error: '' };
    }

    default:
    {
      return {
        valid: false,
        error: `${field}: unknown field`,
      };
    }
  }
}

/**
 * @description Validates the entire contact form data.
 *              Returns all validation errors found.
 * @param {object} data - Form data object
 * @returns {object} { valid: boolean, errors: object }
 * @update 2026-02-11
 */
export function validateContactForm(data)
{
  const errors = {};
  const requiredFields = [
    'name',
    'email',
    'subject',
    'message',
  ];

  for (const field of requiredFields)
  {
    if (!data[field] || !data[field].trim())
    {
      errors[field] = `${field}: is required`;
      continue;
    }

    const result = validateField(field, data[field]);
    if (!result.valid)
    {
      errors[field] = result.error;
    }
  }

  if (data.phone && data.phone.trim())
  {
    const phoneResult = validateField(
      'phone',
      data.phone
    );
    if (!phoneResult.valid)
    {
      errors.phone = phoneResult.error;
    }
  }

  if (data.honeypot && data.honeypot.trim())
  {
    errors._bot = 'Bot detected';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export {
  ALLOWED_PATTERNS,
  ALLOWED_SUBJECTS,
  MAX_LENGTHS,
};
