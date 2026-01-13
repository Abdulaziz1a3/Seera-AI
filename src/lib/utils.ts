import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = 'en'): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(d);
}

export function formatDateShort(date: Date | string, locale: string = 'en'): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
    }).format(d);
}

export function formatDateRange(
    startDate: Date | string,
    endDate?: Date | string | null,
    locale: string = 'en'
): string {
    const start = formatDateShort(startDate, locale);
    const end = endDate ? formatDateShort(endDate, locale) : locale === 'ar' ? 'الحاضر' : 'Present';
    return `${start} - ${end}`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-().]{10,}$/;
    return phoneRegex.test(phone);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

export function getContrastColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function absoluteUrl(path: string): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${path}`;
}

export function generateResumeFileName(
    firstName: string,
    lastName: string,
    role?: string
): string {
    const date = new Date().getFullYear();
    const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '');
    const parts = [sanitize(firstName), sanitize(lastName)];
    if (role) parts.push(sanitize(role));
    parts.push(date.toString());
    return parts.join('_');
}

export function parseResumeDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Try various formats
    const formats = [
        /^(\d{4})$/,                           // 2024
        /^(\d{1,2})\/(\d{4})$/,               // 01/2024
        /^(\w+)\s+(\d{4})$/,                  // January 2024
        /^(\w{3})\s+(\d{4})$/,                // Jan 2024
        /^(\d{4})-(\d{1,2})$/,                // 2024-01
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,      // 2024-01-15
    ];

    for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
            try {
                return new Date(dateStr);
            } catch {
                continue;
            }
        }
    }

    return null;
}

export function calculateDuration(
    startDate: Date | string,
    endDate?: Date | string | null
): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
        return `${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
        return `${years} yr${years !== 1 ? 's' : ''}`;
    } else {
        return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`;
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
}
