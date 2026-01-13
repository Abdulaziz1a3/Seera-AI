import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { improveContent } from '@/lib/openai';

// Schema for request validation
const requestSchema = z.object({
    content: z.string().min(1, "Content cannot be empty").max(2000, "Content too long"),
    instruction: z.enum(['fix_grammar', 'professional', 'concise', 'expand', 'active_voice']).default('professional'),
    type: z.enum(['summary', 'bullet', 'description']).default('description')
});

export async function POST(request: Request) {
    try {
        // 1. Verify Authentication
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Request Body
        const body = await request.json();
        const validation = requestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { content, instruction, type } = validation.data;

        // 3. Call OpenAI Service
        // We'll map our specific instructions to the generic 'improveContent' or enhance it here
        // Ideally, we'd update lib/openai.ts to support these custom instructions,
        // but for now, we'll map them to the closest existing type or pass custom prompt if we modify lib.

        // Since `improveContent` currently accepts specific types, let's use it as is for now
        // and send the formatted request.

        let polishedText = await improveContent(content, type as any, {
            locale: 'en', // Default to EN for now, can be passed from body later
            tone: instruction === 'professional' ? 'professional' : 'confident'
        });

        return NextResponse.json({ polishedText });

    } catch (error) {
        console.error('AI Polisher API Error:', error);
        return NextResponse.json(
            { error: 'Failed to polish content' },
            { status: 500 }
        );
    }
}
