// Stripe Webhook Handler
// Processes subscription and payment events from Stripe

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { handleWebhook } from '@/lib/stripe';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        logger.warn('Stripe webhook missing signature');
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    try {
        const result = await handleWebhook(Buffer.from(body), signature);

        logger.info('Stripe webhook processed', { event: result.event });

        return NextResponse.json({
            received: true,
            event: result.event,
        });
    } catch (error: any) {
        logger.error('Stripe webhook error', { error });

        return NextResponse.json(
            { error: error.message || 'Webhook handler failed' },
            { status: 400 }
        );
    }
}

// Stripe requires raw body for webhook verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
