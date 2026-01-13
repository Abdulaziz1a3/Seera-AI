'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, locales, defaultLocale, localeDirections } from '@/lib/i18n/config';
import { getTranslations, type Translations } from '@/lib/i18n';

interface LocaleContextType {
    locale: Locale;
    t: Translations;
    dir: 'ltr' | 'rtl';
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
    children: ReactNode;
    initialLocale?: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);
    const [t, setT] = useState<Translations>(getTranslations(locale));
    const router = useRouter();
    const pathname = usePathname();

    // Update translations when locale changes
    useEffect(() => {
        setT(getTranslations(locale));

        // Update document direction and lang
        document.documentElement.dir = localeDirections[locale];
        document.documentElement.lang = locale;

        // Save preference to localStorage
        localStorage.setItem('seera-ai-locale', locale);

        // Add/remove RTL class for styling
        if (locale === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
    }, [locale]);

    // Load saved locale on mount
    useEffect(() => {
        const savedLocale = localStorage.getItem('seera-ai-locale') as Locale | null;
        if (savedLocale && locales.includes(savedLocale)) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        if (locales.includes(newLocale)) {
            setLocaleState(newLocale);
        }
    };

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'ar' : 'en');
    };

    const dir = localeDirections[locale];

    return (
        <LocaleContext.Provider value={{ locale, t, dir, setLocale, toggleLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}

// Hook for translations only
export function useTranslations() {
    const { t } = useLocale();
    return t;
}
