import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import deCommon from './locales/de/common.json';
import deQuiz from './locales/de/quiz.json';
import deGames from './locales/de/games.json';
import deAuth from './locales/de/auth.json';

import enCommon from './locales/en/common.json';
import enQuiz from './locales/en/quiz.json';
import enGames from './locales/en/games.json';
import enAuth from './locales/en/auth.json';

import esCommon from './locales/es/common.json';
import esQuiz from './locales/es/quiz.json';
import esGames from './locales/es/games.json';
import esAuth from './locales/es/auth.json';

import frCommon from './locales/fr/common.json';
import frQuiz from './locales/fr/quiz.json';
import frGames from './locales/fr/games.json';
import frAuth from './locales/fr/auth.json';

const resources = {
  de: {
    common: deCommon,
    quiz: deQuiz,
    games: deGames,
    auth: deAuth,
  },
  en: {
    common: enCommon,
    quiz: enQuiz,
    games: enGames,
    auth: enAuth,
  },
  es: {
    common: esCommon,
    quiz: esQuiz,
    games: esGames,
    auth: esAuth,
  },
  fr: {
    common: frCommon,
    quiz: frQuiz,
    games: frGames,
    auth: frAuth,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    // Default namespace
    defaultNS: 'common',
    
    // Namespace separator
    nsSeparator: ':',
  });

export default i18n;