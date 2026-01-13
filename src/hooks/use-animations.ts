'use client';

import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * Hook to check if user prefers reduced motion
 * Useful for disabling animations for accessibility
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

/**
 * Hook to animate elements when they scroll into view
 * Uses Intersection Observer for performance
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: IntersectionObserverInit = {}
): [RefObject<T>, boolean] {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options]);

    return [ref, isVisible];
}

/**
 * Hook for staggered entrance animations
 * Returns a delay value based on index
 */
export function useStaggeredDelay(index: number, baseDelay: number = 0.08): number {
    return index * baseDelay;
}

/**
 * Hook to track if component has mounted
 * Useful for avoiding SSR hydration mismatches with animations
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
}

/**
 * Hook for spring-based counter animation
 * Counts from one number to another with easing
 */
export function useCountUp(
    target: number,
    duration: number = 1500,
    startOnMount: boolean = true
): { value: number; start: () => void; reset: () => void } {
    const [value, setValue] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * easeProgress);

        setValue(currentValue);

        if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            setIsRunning(false);
        }
    };

    const start = () => {
        if (isRunning) return;
        setIsRunning(true);
        startTimeRef.current = 0;
        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const reset = () => {
        cancelAnimationFrame(animationFrameRef.current);
        setValue(0);
        setIsRunning(false);
        startTimeRef.current = 0;
    };

    useEffect(() => {
        if (startOnMount) {
            start();
        }

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [target, startOnMount]);

    return { value, start, reset };
}

/**
 * Hook for hover state with animations
 */
export function useHoverAnimation(): {
    isHovered: boolean;
    hoverProps: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
    };
} {
    const [isHovered, setIsHovered] = useState(false);

    return {
        isHovered,
        hoverProps: {
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
        },
    };
}

/**
 * Hook to detect if element is in viewport
 * Returns true if element is visible
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
    options: IntersectionObserverInit = {}
): [RefObject<T>, boolean] {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options]);

    return [ref, inView];
}

/**
 * Hook for typewriter effect
 */
export function useTypewriter(text: string, speed: number = 50): string {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        setDisplayedText('');

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayedText((prev) => prev + text[indexRef.current]);
                indexRef.current++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return displayedText;
}
