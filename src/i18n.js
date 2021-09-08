import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { intl as i18nFloorballApp } from './components/Floorball/Floorball.i18n';
import { intl as i18nClubs } from './components/Clubs/Clubs.i18n';

// NOTE: temporary solution need move all translations to externale language service
const resources = {
  en: {
    translation: {
      ...i18nFloorballApp.en,
      ...i18nClubs.en,
    },
  },
  uk: {
    translation: {
      ...i18nFloorballApp.uk,
      ...i18nClubs.uk,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
