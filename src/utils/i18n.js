// src/utils/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../i18n/en.json';
import fr from '../i18n/fr.json';
import es from '../i18n/es.json';
import ar from '../i18n/ar.json';
import zh from '../i18n/zh.json';
import ja from '../i18n/ja.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ar: { translation: ar },
      zh: { translation: zh },
      ja: { translation: ja },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;