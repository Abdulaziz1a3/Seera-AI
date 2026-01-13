'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoSaveOptions<T> {
    data: T;
    onSave: (data: T) => Promise<void>;
    debounceMs?: number;
    enabled?: boolean;
}

interface UseAutoSaveReturn {
    isSaving: boolean;
    lastSaved: Date | null;
    hasError: boolean;
    saveNow: () => Promise<void>;
}

export function useAutoSave<T>({
    data,
    onSave,
    debounceMs = 2000,
    enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasError, setHasError] = useState(false);

    const dataRef = useRef(data);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstRender = useRef(true);

    // Update ref when data changes
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    const save = useCallback(async () => {
        if (!enabled) return;

        setIsSaving(true);
        setHasError(false);

        try {
            await onSave(dataRef.current);
            setLastSaved(new Date());
        } catch (error) {
            console.error('Auto-save failed:', error);
            setHasError(true);
        } finally {
            setIsSaving(false);
        }
    }, [enabled, onSave]);

    // Debounced save on data change
    useEffect(() => {
        // Skip first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!enabled) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(save, debounceMs);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, debounceMs, enabled, save]);

    // Save on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                // Synchronous save is not possible, but we can try
                // In production, consider using navigator.sendBeacon
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return {
        isSaving,
        lastSaved,
        hasError,
        saveNow: save,
    };
}
