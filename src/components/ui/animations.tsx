'use client';

import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

// ============================================
// Animation Variants
// ============================================

export const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const fadeInDownVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideInLeftVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideInRightVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
    },
};

// ============================================
// Animation Components
// ============================================

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'variants'> {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    duration?: number;
    className?: string;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
    ({ children, direction = 'up', delay = 0, duration = 0.4, className, ...props }, ref) => {
        const getVariants = (): Variants => {
            const baseTransition = { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] };

            switch (direction) {
                case 'up':
                    return {
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: baseTransition },
                    };
                case 'down':
                    return {
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0, transition: baseTransition },
                    };
                case 'left':
                    return {
                        hidden: { opacity: 0, x: 30 },
                        visible: { opacity: 1, x: 0, transition: baseTransition },
                    };
                case 'right':
                    return {
                        hidden: { opacity: 0, x: -30 },
                        visible: { opacity: 1, x: 0, transition: baseTransition },
                    };
                default:
                    return {
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: baseTransition },
                    };
            }
        };

        return (
            <motion.div
                ref={ref}
                initial="hidden"
                animate="visible"
                variants={getVariants()}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
FadeIn.displayName = 'FadeIn';

// ============================================
// Stagger Container for Lists/Grids
// ============================================

interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'variants'> {
    children: ReactNode;
    staggerDelay?: number;
    initialDelay?: number;
    className?: string;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
    ({ children, staggerDelay = 0.08, initialDelay = 0.1, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: staggerDelay,
                            delayChildren: initialDelay,
                        },
                    },
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
StaggerContainer.displayName = 'StaggerContainer';

// ============================================
// Stagger Item (use inside StaggerContainer)
// ============================================

interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
    children: ReactNode;
    className?: string;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                variants={staggerItemVariants}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
StaggerItem.displayName = 'StaggerItem';

// ============================================
// Scale on Hover (for cards, buttons)
// ============================================

interface ScaleOnHoverProps extends Omit<HTMLMotionProps<'div'>, 'whileHover' | 'whileTap'> {
    children: ReactNode;
    scale?: number;
    tapScale?: number;
    className?: string;
}

export const ScaleOnHover = forwardRef<HTMLDivElement, ScaleOnHoverProps>(
    ({ children, scale = 1.02, tapScale = 0.98, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={{ scale, transition: { duration: 0.2 } }}
                whileTap={{ scale: tapScale, transition: { duration: 0.1 } }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
ScaleOnHover.displayName = 'ScaleOnHover';

// ============================================
// Pulse Animation (for attention-grabbing)
// ============================================

interface PulseProps extends Omit<HTMLMotionProps<'div'>, 'animate'> {
    children: ReactNode;
    duration?: number;
    className?: string;
}

export const Pulse = forwardRef<HTMLDivElement, PulseProps>(
    ({ children, duration = 2, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                animate={{
                    scale: [1, 1.02, 1],
                    opacity: [1, 0.8, 1],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Pulse.displayName = 'Pulse';

// ============================================
// Shimmer Effect (loading placeholder)
// ============================================

interface ShimmerProps {
    className?: string;
    width?: string | number;
    height?: string | number;
}

export function Shimmer({ className = '', width = '100%', height = '1rem' }: ShimmerProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-md bg-muted ${className}`}
            style={{ width, height }}
        >
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                    translateX: ['calculus(-100%)', 'calc(100%)'],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                }}
            />
        </div>
    );
}

// ============================================
// Count Up Animation (for stats)
// ============================================

interface CountUpProps {
    from?: number;
    to: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export function CountUp({ from = 0, to, duration = 1.5, suffix = '', prefix = '', className = '' }: CountUpProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {prefix}
                <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration }}
                >
                    <CountUpNumber from={from} to={to} duration={duration} />
                </motion.span>
                {suffix}
            </motion.span>
        </motion.span>
    );
}

function CountUpNumber({ from, to, duration }: { from: number; to: number; duration: number }) {
    return (
        <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
        >
            {/* Client-side only counter */}
            <CountUpClient from={from} to={to} duration={duration} />
        </motion.span>
    );
}

function CountUpClient({ from, to, duration }: { from: number; to: number; duration: number }) {
    const [count, setCount] = React.useState(from);

    React.useEffect(() => {
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            const currentCount = Math.round(from + (to - from) * easeProgress);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    }, [from, to, duration]);

    return <>{count}</>;
}

// Need to import React for the CountUpClient component
import React from 'react';

// ============================================
// Floating Animation (subtle up/down)
// ============================================

interface FloatProps extends Omit<HTMLMotionProps<'div'>, 'animate'> {
    children: ReactNode;
    duration?: number;
    distance?: number;
    className?: string;
}

export const Float = forwardRef<HTMLDivElement, FloatProps>(
    ({ children, duration = 3, distance = 10, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                animate={{
                    y: [-distance / 2, distance / 2, -distance / 2],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Float.displayName = 'Float';

// ============================================
// Rotate Animation
// ============================================

interface RotateProps extends Omit<HTMLMotionProps<'div'>, 'animate'> {
    children: ReactNode;
    duration?: number;
    className?: string;
}

export const Rotate = forwardRef<HTMLDivElement, RotateProps>(
    ({ children, duration = 8, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Rotate.displayName = 'Rotate';
