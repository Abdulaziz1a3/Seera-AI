import { en } from './locales/en';
import { ar } from './locales/ar';
import { Locale, defaultLocale } from './config';

// Type for translations
export type Translations = typeof en;

// All translations
const translations: Record<Locale, Translations> = {
    en,
    ar,
};

// Get translations for a locale
export function getTranslations(locale: Locale = defaultLocale): Translations {
    return translations[locale] || translations[defaultLocale];
}

// Export everything
export * from './config';
export { en, ar };
