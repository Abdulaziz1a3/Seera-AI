import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, PLANS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const { planId, billing, userId } = await request.json();

        if (!planId || !['pro', 'enterprise'].includes(planId)) {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        if (!billing || !['monthly', 'yearly'].includes(billing)) {
            return NextResponse.json(
                { error: 'Invalid billing period' },
                { status: 400 }
            );
        }

        // In production, get userId from session
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`;

        const checkoutUrl = await createCheckoutSession(
            userId || 'anonymous',
            planId as 'pro' | 'enterprise',
            billing as 'monthly' | 'yearly',
            returnUrl
        );

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
