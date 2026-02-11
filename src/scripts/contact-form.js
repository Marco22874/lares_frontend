/**
 * @file contact-form.js
 * @author Lares Cohousing Dev Team
 * @date 2026-02-11
 * @description Client-side contact form validation
 *              using whitelist approach. Validates all
 *              fields against allowed patterns before
 *              submission. Prevents XSS and injection.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

/**
 * Whitelist patterns - only matching values accepted.
 */
const ALLOWED =
{
  name: /^[a-zA-ZÀ-ÿ\s'\-]{2,100}$/,
  email:
    /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\d\s+\-()]{0,20}$/,
  subject: ['info', 'visit', 'partnership', 'other'],
};

const MAX_MESSAGE_LENGTH = 2000;
const DIRECTUS_URL =
  document.querySelector('[data-directus-url]')
    ?.dataset.directusUrl || '';

/**
 * @description Contact form controller class.
 *              Handles validation, submission, and
 *              error display for the contact form.
 * @update 2026-02-11
 */
class ContactFormController
{
  /**
   * @description Initializes form controller and
   *              binds submit event.
   * @update 2026-02-11
   */
  constructor()
  {
    this.form = document.getElementById(
      'contact-form'
    );

    if (!this.form)
    {
      return;
    }

    this.submitBtn = document.getElementById(
      'contact-submit'
    );
    this.statusEl = document.getElementById(
      'form-status'
    );

    this.form.addEventListener(
      'submit',
      (e) => this._handleSubmit(e)
    );
  }

  /**
   * @description Handles form submission. Validates
   *              all fields, checks honeypot, and
   *              submits to server if valid.
   * @param {Event} event - Submit event
   * @update 2026-02-11
   */
  async _handleSubmit(event)
  {
    event.preventDefault();
    this._clearErrors();

    const data = this._getFormData();

    if (data.honeypot)
    {
      this._showStatus('error', 'Invalid submission');
      return;
    }

    const errors = this._validate(data);

    if (Object.keys(errors).length > 0)
    {
      this._showErrors(errors);
      return;
    }

    this._setSubmitting(true);

    try
    {
      const response = await fetch(
        `${DIRECTUS_URL}/contact-form`,
        {
          method: 'POST',
          headers:
          {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            subject: data.subject,
            message: data.message,
          }),
        }
      );

      if (response.ok)
      {
        this._showStatus('success', '');
        this.form.reset();
      }
      else
      {
        this._showStatus('error', '');
      }
    }
    catch
    {
      this._showStatus('error', '');
    }
    finally
    {
      this._setSubmitting(false);
    }
  }

  /**
   * @description Extracts and trims form field values.
   * @returns {object} Form data object
   * @update 2026-02-11
   */
  _getFormData()
  {
    const fd = new FormData(this.form);
    return {
      name: (fd.get('name') || '').toString().trim(),
      email:
        (fd.get('email') || '').toString().trim(),
      phone:
        (fd.get('phone') || '').toString().trim(),
      subject:
        (fd.get('subject') || '').toString().trim(),
      message:
        (fd.get('message') || '').toString().trim(),
      honeypot:
        (fd.get('honeypot') || '').toString().trim(),
    };
  }

  /**
   * @description Validates all form fields against
   *              whitelist patterns. Returns errors
   *              object with field names as keys.
   * @param {object} data - Form data to validate
   * @returns {object} Validation errors
   * @update 2026-02-11
   */
  _validate(data)
  {
    const errors = {};

    if (!data.name || !ALLOWED.name.test(data.name))
    {
      errors.name = true;
    }

    if (
      !data.email || !ALLOWED.email.test(data.email)
    )
    {
      errors.email = true;
    }

    if (
      data.phone && !ALLOWED.phone.test(data.phone)
    )
    {
      errors.phone = true;
    }

    if (!ALLOWED.subject.includes(data.subject))
    {
      errors.subject = true;
    }

    if (
      !data.message ||
      data.message.length < 10 ||
      data.message.length > MAX_MESSAGE_LENGTH
    )
    {
      errors.message = true;
    }

    return errors;
  }

  /**
   * @description Displays validation errors on
   *              the form fields.
   * @param {object} errors - Error fields object
   * @update 2026-02-11
   */
  _showErrors(errors)
  {
    for (const field of Object.keys(errors))
    {
      const errorEl = document.getElementById(
        `error-${field}`
      );
      const inputEl = this.form.querySelector(
        `[name="${field}"]`
      );

      if (errorEl)
      {
        errorEl.textContent = 'Invalid value';
      }

      if (inputEl)
      {
        inputEl.classList.add('form__input--error');
      }
    }
  }

  /**
   * @description Clears all displayed form errors.
   * @update 2026-02-11
   */
  _clearErrors()
  {
    const errorEls = this.form.querySelectorAll(
      '.form__error'
    );

    for (const el of errorEls)
    {
      el.textContent = '';
    }

    const inputs = this.form.querySelectorAll(
      '.form__input--error'
    );

    for (const el of inputs)
    {
      el.classList.remove('form__input--error');
    }

    if (this.statusEl)
    {
      this.statusEl.textContent = '';
      this.statusEl.className = 'form__status';
    }
  }

  /**
   * @description Shows a status message (success or
   *              error) below the form.
   * @param {string} type - 'success' or 'error'
   * @param {string} customMsg - Optional custom message
   * @update 2026-02-11
   */
  _showStatus(type, customMsg)
  {
    if (!this.statusEl)
    {
      return;
    }

    const locale = this.form.dataset.locale || 'it';
    const messages =
    {
      success:
      {
        it: 'Messaggio inviato con successo!',
        en: 'Message sent successfully!',
        de: 'Nachricht erfolgreich gesendet!',
        fr: 'Message envoyé avec succès !',
      },
      error:
      {
        it: "Errore nell'invio. Riprova.",
        en: 'Error sending. Please try again.',
        de: 'Fehler beim Senden. Bitte erneut.',
        fr: "Erreur lors de l'envoi. Réessayez.",
      },
    };

    this.statusEl.textContent =
      customMsg || messages[type]?.[locale] || '';
    this.statusEl.className =
      `form__status form__status--${type}`;
  }

  /**
   * @description Toggles the submit button disabled
   *              state during submission.
   * @param {boolean} submitting - Is form submitting
   * @update 2026-02-11
   */
  _setSubmitting(submitting)
  {
    if (this.submitBtn)
    {
      this.submitBtn.disabled = submitting;
    }
  }
}

document.addEventListener(
  'DOMContentLoaded',
  () => new ContactFormController()
);
