'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    success?: boolean;
    showValidationIcon?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, success, showValidationIcon = true, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasShake, setHasShake] = React.useState(false);

        // Trigger shake animation when error changes
        React.useEffect(() => {
            if (error) {
                setHasShake(true);
                const timer = setTimeout(() => setHasShake(false), 500);
                return () => clearTimeout(timer);
            }
        }, [error]);

        return (
            <div className="relative">
                <motion.div
                    animate={hasShake ? {
                        x: [0, -8, 8, -8, 8, 0],
                        transition: { duration: 0.4 }
                    } : {}}
                >
                    <input
                        type={type}
                        className={cn(
                            'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                            // Normal state
                            'border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            // Error state
                            error && 'border-destructive focus-visible:ring-destructive pr-10',
                            // Success state
                            success && !error && 'border-success focus-visible:ring-success pr-10',
                            className
                        )}
                        ref={ref}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />
                </motion.div>

                {/* Validation Icons */}
                {showValidationIcon && (
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            </motion.div>
                        )}
                        {success && !error && (
                            <motion.div
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Check className="h-4 w-4 text-success" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            className="mt-1.5 text-sm text-destructive"
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };

