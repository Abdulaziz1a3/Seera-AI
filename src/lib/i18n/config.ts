// Internationalization System for Seera AI
// Supports English (en) and Arabic (ar) with RTL

export type Locale = 'en' | 'ar';

export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
    en: 'English',
    ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
    en: '🇺🇸',
    ar: '🇸🇦',
};

// Direction for each locale
export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
    en: 'ltr',
    ar: 'rtl',
};

// Font families for each locale
export const localeFonts: Record<Locale, string> = {
    en: 'var(--font-inter)',
    ar: 'var(--font-noto-arabic)',
};

// Get locale from path or cookie
export function getLocaleFromPath(pathname: string): Locale {
    const segment = pathname.split('/')[1];
    if (locales.includes(segment as Locale)) {
        return segment as Locale;
    }
    return defaultLocale;
}

// Create localized path
export function localizedPath(path: string, locale: Locale): string {
    if (locale === defaultLocale) {
        return path;
    }
    return `/${locale}${path}`;
}
