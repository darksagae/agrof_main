import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Import translation files
import enCommon from './locales/en/common.json';
import enStore from './locales/en/store.json';
import swCommon from './locales/sw/common.json';
import swStore from './locales/sw/store.json';
import lgCommon from './locales/lg/common.json';
import lgStore from './locales/lg/store.json';
import rnCommon from './locales/rn/common.json';
import rnStore from './locales/rn/store.json';

// Language detection
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        // Default to English if no saved language
        callback('en');
      }
    } catch (error) {
      console.log('Error reading language from storage:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.log('Error saving language to storage:', error);
    }
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        store: enStore
      },
      sw: {
        common: swCommon,
        store: swStore
      },
      lg: {
        common: lgCommon,
        store: lgStore
      },
      rn: {
        common: rnCommon,
        store: rnStore
      }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
