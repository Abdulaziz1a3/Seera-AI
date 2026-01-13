'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showValue?: boolean;
    showPercent?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'destructive' | 'auto';
    animated?: boolean;
    label?: string;
}

export function ProgressRing({
    value,
    max = 100,
    size = 120,
    strokeWidth = 10,
    className,
    showValue = true,
    showPercent = true,
    color = 'auto',
    animated = true,
    label,
}: ProgressRingProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Auto color based on percentage
    const getColor = () => {
        if (color !== 'auto') return color;
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'warning';
        return 'destructive';
    };

    const colorClass = getColor();
    const strokeColor = {
        primary: 'stroke-primary',
        success: 'stroke-success',
        warning: 'stroke-warning',
        destructive: 'stroke-destructive',
    }[colorClass];

    const textColor = {
        primary: 'text-primary',
        success: 'text-success',
        warning: 'text-warning',
        destructive: 'text-destructive',
    }[colorClass];

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-muted"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    className={cn('transition-colors', strokeColor)}
                    style={{
                        strokeDasharray: circumference,
                    }}
                    initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {showValue && (
                    <motion.span
                        className={cn('text-2xl font-bold', textColor)}
                        initial={animated ? { opacity: 0, scale: 0.5 } : {}}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        {Math.round(percentage)}{showPercent && '%'}
                    </motion.span>
                )}
                {label && (
                    <motion.span
                        className="text-xs text-muted-foreground mt-1"
                        initial={animated ? { opacity: 0 } : {}}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        {label}
                    </motion.span>
                )}
            </div>
        </div>
    );
}

// Mini version for inline use
interface MiniProgressRingProps {
    value: number;
    max?: number;
    size?: number;
    className?: string;
}

export function MiniProgressRing({
    value,
    max = 100,
    size = 24,
    className,
}: MiniProgressRingProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 80) return 'stroke-success';
        if (percentage >= 60) return 'stroke-warning';
        return 'stroke-destructive';
    };

    return (
        <svg
            width={size}
            height={size}
            className={cn('transform -rotate-90', className)}
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                className="text-muted"
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                className={getColor()}
                style={{ strokeDasharray: circumference }}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </svg>
    );
}
