'use client';

import { cn } from '@/lib/utils';

interface SkipLinkProps {
    href?: string;
    children?: React.ReactNode;
    className?: string;
}

export function SkipLink({
    href = '#main-content',
    children = 'Skip to main content',
    className,
}: SkipLinkProps) {
    return (
        <a
            href={href}
            className={cn(
                'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:flex focus:items-center focus:justify-center focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                className
            )}
        >
            {children}
        </a>
    );
}

// Visually hidden component for screen reader text
interface VisuallyHiddenProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export function VisuallyHidden({ children, asChild }: VisuallyHiddenProps) {
    const Comp = asChild ? 'span' : 'span';
    return (
        <Comp className="sr-only">
            {children}
        </Comp>
    );
}

// Focus trap component for modals
interface FocusTrapProps {
    children: React.ReactNode;
    active?: boolean;
}

export function FocusTrap({ children, active = true }: FocusTrapProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!active) return;

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        firstElement?.focus();

        return () => container.removeEventListener('keydown', handleKeyDown);
    }, [active]);

    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
}

import React from 'react';

// Live region for announcements
interface LiveRegionProps {
    message: string;
    assertive?: boolean;
}

export function LiveRegion({ message, assertive = false }: LiveRegionProps) {
    return (
        <div
            role="status"
            aria-live={assertive ? 'assertive' : 'polite'}
            aria-atomic="true"
            className="sr-only"
        >
            {message}
        </div>
    );
}

// Hook for announcing messages to screen readers
export function useAnnounce() {
    const [message, setMessage] = React.useState('');
    const [assertive, setAssertive] = React.useState(false);

    const announce = React.useCallback((text: string, isAssertive = false) => {
        setMessage(''); // Clear first to ensure new message is announced
        setAssertive(isAssertive);
        setTimeout(() => setMessage(text), 100);
    }, []);

    return {
        message,
        assertive,
        announce,
        LiveRegion: () => <LiveRegion message={message} assertive={assertive} />,
    };
}

// Keyboard shortcut display
interface KeyboardShortcutProps {
    keys: string[];
    className?: string;
}

export function KeyboardShortcut({ keys, className }: KeyboardShortcutProps) {
    return (
        <div className={cn('inline-flex items-center gap-1', className)}>
            {keys.map((key, index) => (
                <React.Fragment key={key}>
                    <kbd className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] font-medium">
                        {key}
                    </kbd>
                    {index < keys.length - 1 && <span className="text-xs text-muted-foreground">+</span>}
                </React.Fragment>
            ))}
        </div>
    );
}
