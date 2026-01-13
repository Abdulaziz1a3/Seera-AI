'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    velocityX: number;
    velocityY: number;
}

interface ConfettiProps {
    isActive: boolean;
    duration?: number;
    particleCount?: number;
    colors?: string[];
    onComplete?: () => void;
}

const defaultColors = [
    '#8B5CF6', // Purple (primary)
    '#22D3EE', // Cyan (accent)
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#6366F1', // Indigo
];

export function Confetti({
    isActive,
    duration = 3000,
    particleCount = 50,
    colors = defaultColors,
    onComplete,
}: ConfettiProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = React.useState<ConfettiPiece[]>([]);

    const createPieces = useCallback(() => {
        const newPieces: ConfettiPiece[] = [];
        for (let i = 0; i < particleCount; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 8 + Math.random() * 8,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: 2 + Math.random() * 4,
            });
        }
        return newPieces;
    }, [particleCount, colors]);

    useEffect(() => {
        if (isActive) {
            setPieces(createPieces());
            const timer = setTimeout(() => {
                setPieces([]);
                onComplete?.();
            }, duration);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [isActive, createPieces, duration, onComplete]);

    if (!isActive && pieces.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
            <AnimatePresence>
                {pieces.map((piece) => (
                    <motion.div
                        key={piece.id}
                        className="absolute"
                        style={{
                            left: `${piece.x}%`,
                            width: piece.size,
                            height: piece.size,
                            backgroundColor: piece.color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '0',
                        }}
                        initial={{
                            y: `${piece.y}vh`,
                            rotate: piece.rotation,
                            opacity: 1,
                        }}
                        animate={{
                            y: '120vh',
                            x: `${piece.velocityX * 30}vw`,
                            rotate: piece.rotation + 720,
                            opacity: [1, 1, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: duration / 1000,
                            ease: 'linear',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Hook for easy confetti triggering
import React from 'react';

export function useConfetti(duration = 3000) {
    const [isActive, setIsActive] = React.useState(false);

    const trigger = useCallback(() => {
        setIsActive(true);
    }, []);

    const handleComplete = useCallback(() => {
        setIsActive(false);
    }, []);

    return {
        isActive,
        trigger,
        Confetti: () => (
            <Confetti
                isActive={isActive}
                duration={duration}
                onComplete={handleComplete}
            />
        ),
    };
}

// Celebration component with message
interface CelebrationProps {
    isVisible: boolean;
    title?: string;
    description?: string;
    onClose?: () => void;
}

export function Celebration({
    isVisible,
    title = '🎉 Congratulations!',
    description = 'Great job completing your task!',
    onClose,
}: CelebrationProps) {
    const [showConfetti, setShowConfetti] = React.useState(false);

    React.useEffect(() => {
        if (isVisible) {
            setShowConfetti(true);
        }
    }, [isVisible]);

    return (
        <>
            <Confetti
                isActive={showConfetti}
                onComplete={() => setShowConfetti(false)}
            />
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className="bg-card rounded-2xl p-8 shadow-2xl border text-center max-w-md mx-4"
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                className="text-6xl mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                            >
                                🎉
                            </motion.div>
                            <motion.h2
                                className="text-2xl font-bold mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {title}
                            </motion.h2>
                            <motion.p
                                className="text-muted-foreground"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {description}
                            </motion.p>
                            {onClose && (
                                <motion.button
                                    className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={onClose}
                                >
                                    Continue
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
