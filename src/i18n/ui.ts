export const languages = {
  en: 'English',
  tr: 'Türkçe',
};

export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.blog': 'Blog',
    'nav.contact': "Let's Talk",
    'footer.rights': 'All rights reserved.',
  },
  tr: {
    'nav.about': 'Hakkımda',
    'nav.services': 'Hizmetler',
    'nav.work': 'Çalışmalar',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişime Geç',
    'footer.rights': 'Tüm hakları saklıdır.',
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
