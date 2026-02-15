/* ───────────────────────────────────────────────
   PowerTread SPA — Internationalization Module
   Reads locale data from window.PT_LOCALES
   (populated by content/*.js script tags)
   ─────────────────────────────────────────────── */

(function () {
  'use strict';

  var SUPPORTED_LOCALES = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    it: 'Italiano'
  };

  var STORAGE_KEY = 'pt-locale';
  var DEFAULT_LOCALE = 'en';

  var currentLocale = DEFAULT_LOCALE;
  var strings = {};

  /** Detect the best locale from the browser */
  function detectLocale() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LOCALES[stored]) return stored;
    } catch (e) { /* localStorage unavailable */ }

    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      var code = langs[i].split('-')[0].toLowerCase();
      if (SUPPORTED_LOCALES[code]) return code;
    }
    return DEFAULT_LOCALE;
  }

  /** Initialize — pick locale and load strings from the global */
  function init() {
    currentLocale = detectLocale();
    var locales = window.PT_LOCALES || {};
    strings = locales[currentLocale] || locales[DEFAULT_LOCALE] || {};
    return strings;
  }

  /** Switch to a different locale */
  function setLocale(locale) {
    if (!SUPPORTED_LOCALES[locale] || locale === currentLocale) return;
    currentLocale = locale;
    try { localStorage.setItem(STORAGE_KEY, locale); } catch (e) { /* ok */ }
    var locales = window.PT_LOCALES || {};
    strings = locales[locale] || locales[DEFAULT_LOCALE] || {};
    document.documentElement.lang = locale;
    return strings;
  }

  function getLocale() { return currentLocale; }
  function getStrings() { return strings; }
  function getLocales() { return SUPPORTED_LOCALES; }

  // Expose on a namespace
  window.PTi18n = {
    init: init,
    setLocale: setLocale,
    getLocale: getLocale,
    getStrings: getStrings,
    getLocales: getLocales
  };
})();
