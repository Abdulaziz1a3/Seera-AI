'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

export function PageTransition({ children, className }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Fade only transition (more subtle)
const fadeVariants = {
    initial: { opacity: 0 },
    enter: {
        opacity: 1,
        transition: { duration: 0.25, ease: 'easeOut' },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15, ease: 'easeIn' },
    },
};

export function FadeTransition({ children, className }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={fadeVariants}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Slide transition
const slideVariants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

export function SlideTransition({ children, className }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={slideVariants}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Scale transition (for modals/dialogs)
const scaleVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

export function ScaleTransition({ children, className }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={scaleVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
