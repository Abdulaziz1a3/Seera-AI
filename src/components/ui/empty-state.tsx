'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Sparkles, Wand2 } from 'lucide-react';
import { useLocale } from '@/components/providers/locale-provider';
import Link from 'next/link';

interface EmptyStateProps {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    action?: {
        label: { en: string; ar: string };
        href: string;
    };
    icon?: React.ElementType;
    className?: string;
}

export function EmptyState({
    title,
    description,
    action,
    icon: Icon = FileText,
    className
}: EmptyStateProps) {
    const { locale } = useLocale();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-muted/20 p-12 text-center",
                className
            )}
        >
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto">
                {/* Premium Animated Icon Composition */}
                <div className="relative mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center border border-primary/20 shadow-sm"
                    >
                        <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                    </motion.div>

                    {/* Floating Decorative Elements */}
                    <motion.div
                        animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-4 -top-4 bg-background p-2 rounded-xl shadow-sm border"
                    >
                        <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute -left-4 -bottom-2 bg-background p-2 rounded-xl shadow-sm border"
                    >
                        <Wand2 className="w-4 h-4 text-blue-400" />
                    </motion.div>
                </div>

                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-3"
                >
                    {locale === 'ar' ? title.ar : title.en}
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-base leading-relaxed mb-8"
                >
                    {locale === 'ar' ? description.ar : description.en}
                </motion.p>

                {action && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button asChild size="lg" className="h-12 px-8 rounded-full shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                            <Link href={action.href}>
                                <Plus className="w-5 h-5 me-2" />
                                {locale === 'ar' ? action.label.ar : action.label.en}
                            </Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
