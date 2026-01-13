'use client';

import { useLocale } from '@/components/providers/locale-provider';
import { localeNames, localeFlags, type Locale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
    variant?: 'button' | 'dropdown' | 'toggle';
    showLabel?: boolean;
    className?: string;
}

export function LanguageSwitcher({
    variant = 'dropdown',
    showLabel = true,
    className,
}: LanguageSwitcherProps) {
    const { locale, setLocale, toggleLocale } = useLocale();

    if (variant === 'toggle') {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleLocale}
                className={className}
            >
                <span className="text-lg mr-1">{localeFlags[locale === 'en' ? 'ar' : 'en']}</span>
                {showLabel && (
                    <span className="text-sm">
                        {locale === 'en' ? 'العربية' : 'English'}
                    </span>
                )}
            </Button>
        );
    }

    if (variant === 'button') {
        return (
            <div className={`flex gap-1 ${className}`}>
                <Button
                    variant={locale === 'en' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLocale('en')}
                >
                    EN
                </Button>
                <Button
                    variant={locale === 'ar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLocale('ar')}
                >
                    عربي
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={className}
                >
                    <Globe className="h-4 w-4 me-1" />
                    <span className="text-lg">{localeFlags[locale]}</span>
                    {showLabel && (
                        <span className="ms-1 text-sm hidden sm:inline">
                            {localeNames[locale]}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => setLocale('en')}
                    className={`flex items-center gap-2 ${locale === 'en' ? 'bg-accent' : ''}`}
                >
                    <span className="text-lg">{localeFlags.en}</span>
                    <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLocale('ar')}
                    className={`flex items-center gap-2 ${locale === 'ar' ? 'bg-accent' : ''}`}
                >
                    <span className="text-lg">{localeFlags.ar}</span>
                    <span>العربية</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
