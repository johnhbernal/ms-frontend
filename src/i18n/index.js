import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import esCO from './locales/es-CO.json';
import en from './locales/en.json';

export const SUPPORTED_LANGS = [
  { code: 'es-CO', labelKey: 'app.esCO' },
  { code: 'en', labelKey: 'app.en' },
];

const STORAGE_KEY = 'practica.lang';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'es-CO': { translation: esCO },
      en: { translation: en },
    },
    supportedLngs: ['es-CO', 'en'],
    fallbackLng: 'es-CO',
    // Map bare "es" from browser → Colombia locale
    load: 'currentOnly',
    nonExplicitSupportedLngs: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => {
        if (!lng) return 'es-CO';
        const lower = lng.toLowerCase();
        if (lower.startsWith('es')) return 'es-CO';
        if (lower.startsWith('en')) return 'en';
        return 'es-CO';
      },
    },
  });

export function setAppLanguage(code) {
  const next = code === 'en' ? 'en' : 'es-CO';
  localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next === 'en' ? 'en' : 'es-CO';
  return i18n.changeLanguage(next);
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language?.startsWith('en') ? 'en' : 'es-CO';
}

export default i18n;
