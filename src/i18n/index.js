// Languages of the main page. Japanese is served at the root, the others under
// /en/ and /zh/, each as its own static page.
import en from './en.json';
import ja from './ja.json';
import zh from './zh.json';

export const LANGUAGES = ['ja', 'en', 'zh'];
export const DEFAULT_LANGUAGE = 'ja';
export const LANGUAGE_NAMES = { ja: '日本語', en: 'English', zh: '简体中文' };
const dictionaries = { en, ja, zh };

/** BCP 47 tag for the lang attribute (Chinese is Simplified). */
export const htmlLang = (language) => (language === 'zh' ? 'zh-Hans' : language);

/** A UI string; throws on a missing key so a typo fails the build. */
export function t(language, key) {
  const value = dictionaries[language]?.[key];
  if (typeof value !== 'string') throw new Error(`Missing translation "${key}" for ${language}`);
  return value;
}

/** Pick a language from an { en, ja, zh } object, falling back to English. */
export const localized = (text, language) => text?.[language] ?? text?.en;

/** Site-relative path of the main page in a language, including the base. */
export function pathFor(language) {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return language === DEFAULT_LANGUAGE ? base : `${base}${language}/`;
}
