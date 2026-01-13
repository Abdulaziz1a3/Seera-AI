import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { generateVerificationToken } from '@/lib/auth';
import { sendPasswordResetEmail, isEmailConfigured } from '@/lib/email';
import { logger } from '@/lib/logger';

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = forgotPasswordSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            logger.info('Password reset requested for non-existent email', { email });
            return NextResponse.json(
                { message: 'If an account exists, a reset link will be sent.' },
                { status: 200 }
            );
        }

        // Generate password reset token (1 hour expiry)
        const token = await generateVerificationToken(email, 'PASSWORD_RESET');

        // Send password reset email
        if (isEmailConfigured()) {
            const emailResult = await sendPasswordResetEmail(email, token, user.name || undefined);

            if (!emailResult.success) {
                logger.error('Failed to send password reset email', {
                    userId: user.id,
                    email,
                    error: emailResult.error,
                });
            } else {
                logger.info('Password reset email sent', { userId: user.id, email });
            }
        } else {
            // Log token for development when email not configured
            logger.warn('Email not configured - password reset token generated', {
                email,
                token: process.env.NODE_ENV === 'development' ? token : '[HIDDEN]',
            });
        }

        return NextResponse.json(
            { message: 'If an account exists, a reset link will be sent.' },
            { status: 200 }
        );
    } catch (error) {
        logger.error('Forgot password error', { error: error as Error });

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
