import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';

// The resources are defined with a type to ensure all keys are strings
const resources: { [lang: string]: { translation: object } } = {
  en, es, pt, fr, de, it, zh, ko, ja, ru, ar, hi,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already handles this
    },
  });

export default i18n;