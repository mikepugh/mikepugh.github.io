/* ───────────────────────────────────────────────
   PowerTread SPA — Internationalization Module
   ─────────────────────────────────────────────── */

const SUPPORTED_LOCALES = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano'
};

const STORAGE_KEY = 'pt-locale';
const DEFAULT_LOCALE = 'en';

let currentLocale = DEFAULT_LOCALE;
let strings = {};
let onLocaleChange = null;

/** Detect the best locale from the browser */
function detectLocale() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES[stored]) return stored;

  const langs = navigator.languages || [navigator.language || ''];
  for (const lang of langs) {
    const code = lang.split('-')[0].toLowerCase();
    if (SUPPORTED_LOCALES[code]) return code;
  }
  return DEFAULT_LOCALE;
}

/** Load a locale's JSON content file */
async function loadLocale(locale) {
  const resp = await fetch(`content/${locale}.json`);
  if (!resp.ok) throw new Error(`Failed to load locale: ${locale}`);
  return resp.json();
}

/** Initialize the i18n system */
async function init(changeCallback) {
  onLocaleChange = changeCallback;
  currentLocale = detectLocale();
  strings = await loadLocale(currentLocale);
  return strings;
}

/** Switch to a different locale */
async function setLocale(locale) {
  if (!SUPPORTED_LOCALES[locale] || locale === currentLocale) return;
  currentLocale = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  strings = await loadLocale(locale);
  document.documentElement.lang = locale;
  if (onLocaleChange) onLocaleChange(strings);
}

/** Get the current locale code */
function getLocale() {
  return currentLocale;
}

/** Get the current strings object */
function getStrings() {
  return strings;
}

/** Get all supported locales */
function getLocales() {
  return SUPPORTED_LOCALES;
}

export { init, setLocale, getLocale, getStrings, getLocales };
