import { NextRequest, NextResponse } from 'next/server';
import {
    generateHeadlines,
    generateAboutSection,
    optimizeExperience,
    optimizeSkills,
    optimizeFullProfile,
} from '@/lib/linkedin-optimizer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, resume, options = {} } = body;

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API not configured' },
                { status: 500 }
            );
        }

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume data is required' },
                { status: 400 }
            );
        }

        let result;

        switch (action) {
            case 'headlines':
                result = await generateHeadlines(resume, options);
                break;

            case 'about':
                result = await generateAboutSection(resume, options);
                break;

            case 'experience':
                result = await optimizeExperience(resume, options);
                break;

            case 'skills':
                result = await optimizeSkills(resume, options);
                break;

            case 'full':
                result = await optimizeFullProfile(resume, options);
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error('LinkedIn API Error:', error);
        return NextResponse.json(
            { error: error.message || 'LinkedIn optimization failed' },
            { status: 500 }
        );
    }
}
