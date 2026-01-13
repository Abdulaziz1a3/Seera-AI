'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react';

interface AutoSaveIndicatorProps {
    isSaving: boolean;
    lastSaved: Date | null;
    hasError: boolean;
}

export function AutoSaveIndicator({ isSaving, lastSaved, hasError }: AutoSaveIndicatorProps) {
    const { locale } = useLocale();
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (lastSaved && !isSaving) {
            setShowSaved(true);
            const timer = setTimeout(() => setShowSaved(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [lastSaved, isSaving]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (hasError) {
        return (
            <div className="flex items-center gap-2 text-destructive text-sm">
                <CloudOff className="h-4 w-4" />
                <span>{locale === 'ar' ? 'فشل الحفظ' : 'Save failed'}</span>
            </div>
        );
    }

    if (isSaving) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{locale === 'ar' ? 'جارٍ الحفظ...' : 'Saving...'}</span>
            </div>
        );
    }

    if (showSaved && lastSaved) {
        return (
            <div className="flex items-center gap-2 text-green-600 text-sm animate-in fade-in duration-200">
                <Check className="h-4 w-4" />
                <span>{locale === 'ar' ? 'تم الحفظ ✓' : 'Saved ✓'}</span>
            </div>
        );
    }

    if (lastSaved) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Cloud className="h-4 w-4" />
                <span>
                    {locale === 'ar' ? 'آخر حفظ' : 'Last saved'} {formatTime(lastSaved)}
                </span>
            </div>
        );
    }

    return null;
}
