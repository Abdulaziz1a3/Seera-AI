import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { generateBulletPoints } from '@/lib/ai';

const requestSchema = z.object({
    company: z.string(),
    position: z.string(),
    description: z.string().optional(),
    existingBullets: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { company, position, description = '', existingBullets = [] } = requestSchema.parse(body);

        // Generate bullet points
        const bullets = await generateBulletPoints(company, position, description, existingBullets);

        return NextResponse.json({ bullets });
    } catch (error) {
        console.error('Generate bullets error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate bullet points' },
            { status: 500 }
        );
    }
}
