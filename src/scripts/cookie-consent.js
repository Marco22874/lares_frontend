/**
 * @file cookie-consent.js
 * @author Lares Cohousing Dev Team
 * @date 2026-02-11
 * @description GDPR cookie consent manager. Shows
 *              banner on first visit, stores preference
 *              in localStorage. Blocks non-essential
 *              cookies until explicit consent.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

const STORAGE_KEY = 'lares_cookie_consent';

/**
 * @description Cookie consent controller class.
 *              Manages banner display and user
 *              preference storage.
 * @update 2026-02-11
 */
class CookieConsentController
{
  /**
   * @description Initializes consent controller.
   *              Checks stored preference and shows
   *              banner if no decision was made.
   * @update 2026-02-11
   */
  constructor()
  {
    this.banner = document.getElementById(
      'cookie-banner'
    );

    if (!this.banner)
    {
      return;
    }

    const stored = this._getConsent();

    if (stored === null)
    {
      this._showBanner();
    }

    this._bindEvents();
  }

  /**
   * @description Binds click events to accept/reject
   *              buttons using event delegation.
   * @update 2026-02-11
   */
  _bindEvents()
  {
    this.banner.addEventListener('click', (e) =>
    {
      const target = e.target.closest(
        '[data-cookie-action]'
      );

      if (!target)
      {
        return;
      }

      const action = target.dataset.cookieAction;

      switch (action)
      {
        case 'accept':
          this._setConsent('all');
          break;
        case 'reject':
          this._setConsent('necessary');
          break;
        default:
          break;
      }

      this._hideBanner();
    });
  }

  /**
   * @description Shows the cookie consent banner.
   * @update 2026-02-11
   */
  _showBanner()
  {
    this.banner.classList.remove(
      'cookie-banner--hidden'
    );
    this.banner.setAttribute(
      'aria-hidden',
      'false'
    );
  }

  /**
   * @description Hides the cookie consent banner.
   * @update 2026-02-11
   */
  _hideBanner()
  {
    this.banner.classList.add(
      'cookie-banner--hidden'
    );
    this.banner.setAttribute(
      'aria-hidden',
      'true'
    );
  }

  /**
   * @description Retrieves stored consent preference.
   * @returns {string|null} Consent level or null
   * @update 2026-02-11
   */
  _getConsent()
  {
    try
    {
      return localStorage.getItem(STORAGE_KEY);
    }
    catch
    {
      return null;
    }
  }

  /**
   * @description Stores the user's consent preference.
   * @param {string} level - 'all' or 'necessary'
   * @update 2026-02-11
   */
  _setConsent(level)
  {
    try
    {
      localStorage.setItem(STORAGE_KEY, level);
    }
    catch
    {
      /* Storage not available */
    }
  }
}

document.addEventListener(
  'DOMContentLoaded',
  () => new CookieConsentController()
);
