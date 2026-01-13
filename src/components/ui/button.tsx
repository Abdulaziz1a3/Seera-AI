'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]',
                outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
                ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
                link: 'text-primary underline-offset-4 hover:underline',
                success: 'bg-success text-success-foreground hover:bg-success/90 active:scale-[0.98]',
                warning: 'bg-warning text-warning-foreground hover:bg-warning/90 active:scale-[0.98]',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                xl: 'h-12 rounded-lg px-10 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    enableRipple?: boolean;
}

interface RippleProps {
    x: number;
    y: number;
    size: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, enableRipple = true, children, disabled, onClick, ...props }, ref) => {
        const [ripples, setRipples] = React.useState<RippleProps[]>([]);
        const buttonRef = React.useRef<HTMLButtonElement>(null);

        // Merge refs
        React.useImperativeHandle(ref, () => buttonRef.current!);

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (enableRipple && buttonRef.current && variant !== 'link') {
                const rect = buttonRef.current.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 2;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                const newRipple = { x, y, size };
                setRipples((prev) => [...prev, newRipple]);

                // Clean up ripple after animation
                setTimeout(() => {
                    setRipples((prev) => prev.slice(1));
                }, 600);
            }

            onClick?.(e);
        };

        if (asChild) {
            return (
                <Slot
                    className={cn(buttonVariants({ variant, size, className }))}
                    {...props}
                >
                    {children}
                </Slot>
            );
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={buttonRef}
                disabled={disabled || isLoading}
                onClick={handleClick}
                {...props}
            >
                {/* Ripple Effects */}
                <AnimatePresence>
                    {ripples.map((ripple, index) => (
                        <motion.span
                            key={index}
                            className="absolute rounded-full bg-white/30 pointer-events-none"
                            style={{
                                left: ripple.x,
                                top: ripple.y,
                                width: ripple.size,
                                height: ripple.size,
                            }}
                            initial={{ scale: 0, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    ))}
                </AnimatePresence>

                {/* Loading State */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.span
                            key="loading"
                            className="flex items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                        >
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Loading...
                        </motion.span>
                    ) : (
                        <motion.span
                            key="content"
                            className="flex items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                        >
                            {children}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

