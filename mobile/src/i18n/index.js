import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { recursos } from './locales';

i18n.use(initReactI18next).init({
  resources: recursos,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v3',
});

export default i18n;
