/**
 * @file i18n.js
 * @author Marco De Luca
 * @date 2026-02-11
 * @description Internationalization utilities for
 *              multilingual routing and translation
 *              helpers. Manages locale detection and
 *              URL generation for IT, EN, DE, FR.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

const SUPPORTED_LOCALES = ['it', 'en', 'de', 'fr'];
const DEFAULT_LOCALE = 'it';

/**
 * Static UI strings for navigation and common elements.
 * Content-heavy strings come from Directus instead.
 */
const UI_STRINGS =
{
  it:
  {
    nav_home: 'Home',
    nav_about: 'Chi Siamo',
    nav_location: 'Dove Siamo',
    nav_gallery: 'Gallery',
    nav_services: 'Servizi',
    nav_contact: 'Contatti',
    nav_privacy: 'Privacy Policy',
    nav_cookies: 'Cookie Policy',
    lang_label: 'Lingua',
    cookie_accept: 'Accetta tutti',
    cookie_reject: 'Solo necessari',
    cookie_customize: 'Personalizza',
    cookie_message:
      'Utilizziamo cookie per migliorare ' +
      'la tua esperienza.',
    form_send: 'Invia',
    form_name: 'Nome',
    form_email: 'Email',
    form_phone: 'Telefono',
    form_subject: 'Oggetto',
    form_message: 'Messaggio',
    form_success: 'Messaggio inviato con successo!',
    form_error: 'Errore nell\'invio. Riprova.',
    form_required: 'Campo obbligatorio',
    form_invalid: 'Valore non valido',
  },
  en:
  {
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_location: 'Where We Are',
    nav_gallery: 'Gallery',
    nav_services: 'Services',
    nav_contact: 'Contact',
    nav_privacy: 'Privacy Policy',
    nav_cookies: 'Cookie Policy',
    lang_label: 'Language',
    cookie_accept: 'Accept all',
    cookie_reject: 'Necessary only',
    cookie_customize: 'Customize',
    cookie_message:
      'We use cookies to improve your experience.',
    form_send: 'Send',
    form_name: 'Name',
    form_email: 'Email',
    form_phone: 'Phone',
    form_subject: 'Subject',
    form_message: 'Message',
    form_success: 'Message sent successfully!',
    form_error: 'Error sending. Please try again.',
    form_required: 'Required field',
    form_invalid: 'Invalid value',
  },
  de:
  {
    nav_home: 'Home',
    nav_about: 'Über Uns',
    nav_location: 'Wo Wir Sind',
    nav_gallery: 'Galerie',
    nav_services: 'Dienstleistungen',
    nav_contact: 'Kontakt',
    nav_privacy: 'Datenschutz',
    nav_cookies: 'Cookie-Richtlinie',
    lang_label: 'Sprache',
    cookie_accept: 'Alle akzeptieren',
    cookie_reject: 'Nur notwendige',
    cookie_customize: 'Anpassen',
    cookie_message:
      'Wir verwenden Cookies, um Ihre ' +
      'Erfahrung zu verbessern.',
    form_send: 'Senden',
    form_name: 'Name',
    form_email: 'E-Mail',
    form_phone: 'Telefon',
    form_subject: 'Betreff',
    form_message: 'Nachricht',
    form_success: 'Nachricht erfolgreich gesendet!',
    form_error:
      'Fehler beim Senden. Bitte versuchen ' +
      'Sie es erneut.',
    form_required: 'Pflichtfeld',
    form_invalid: 'Ungültiger Wert',
  },
  fr:
  {
    nav_home: 'Accueil',
    nav_about: 'Qui Sommes-Nous',
    nav_location: 'Où Sommes-Nous',
    nav_gallery: 'Galerie',
    nav_services: 'Services',
    nav_contact: 'Contact',
    nav_privacy: 'Politique de confidentialité',
    nav_cookies: 'Politique de cookies',
    lang_label: 'Langue',
    cookie_accept: 'Tout accepter',
    cookie_reject: 'Nécessaires uniquement',
    cookie_customize: 'Personnaliser',
    cookie_message:
      'Nous utilisons des cookies pour ' +
      'améliorer votre expérience.',
    form_send: 'Envoyer',
    form_name: 'Nom',
    form_email: 'Email',
    form_phone: 'Téléphone',
    form_subject: 'Objet',
    form_message: 'Message',
    form_success: 'Message envoyé avec succès !',
    form_error:
      'Erreur lors de l\'envoi. Veuillez réessayer.',
    form_required: 'Champ obligatoire',
    form_invalid: 'Valeur invalide',
  },
};

/**
 * Route slugs per locale for generating correct URLs.
 */
const ROUTE_SLUGS =
{
  it:
  {
    home: '',
    about: 'chi-siamo',
    location: 'dove-siamo',
    gallery: 'gallery',
    services: 'servizi',
    contact: 'contatti',
    privacy: 'privacy-policy',
    cookies: 'cookie-policy',
  },
  en:
  {
    home: '',
    about: 'about-us',
    location: 'where-we-are',
    gallery: 'gallery',
    services: 'services',
    contact: 'contact',
    privacy: 'privacy-policy',
    cookies: 'cookie-policy',
  },
  de:
  {
    home: '',
    about: 'ueber-uns',
    location: 'wo-wir-sind',
    gallery: 'galerie',
    services: 'dienstleistungen',
    contact: 'kontakt',
    privacy: 'datenschutz',
    cookies: 'cookie-richtlinie',
  },
  fr:
  {
    home: '',
    about: 'qui-sommes-nous',
    location: 'ou-sommes-nous',
    gallery: 'galerie',
    services: 'services',
    contact: 'contact',
    privacy: 'politique-confidentialite',
    cookies: 'politique-cookies',
  },
};

/**
 * @description Returns a translated UI string for
 *              the given locale and key.
 * @param {string} locale - Language code
 * @param {string} key - Translation key
 * @returns {string} Translated string or key as fallback
 * @update 2026-02-11
 */
export function t(locale, key)
{
  const lang = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;

  return UI_STRINGS[lang]?.[key] || key;
}

/**
 * @description Generates a localized URL path for
 *              a given route name and locale.
 * @param {string} locale - Language code
 * @param {string} route - Route name (home, about, etc.)
 * @returns {string} Localized URL path
 * @update 2026-02-11
 */
export function localizedPath(locale, route)
{
  const lang = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;

  const slug = ROUTE_SLUGS[lang]?.[route] ?? route;

  if (slug === '')
  {
    return `/${lang}/`;
  }

  return `/${lang}/${slug}/`;
}

/**
 * @description Extracts the locale from a URL path.
 * @param {string} path - URL pathname
 * @returns {string} Detected locale or default
 * @update 2026-02-11
 */
export function getLocaleFromPath(path)
{
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';

  if (SUPPORTED_LOCALES.includes(firstSegment))
  {
    return firstSegment;
  }

  return DEFAULT_LOCALE;
}

export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  UI_STRINGS,
  ROUTE_SLUGS,
};
