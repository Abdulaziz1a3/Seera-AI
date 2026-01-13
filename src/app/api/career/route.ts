import { NextRequest, NextResponse } from 'next/server';
import {
    analyzeCareer,
    generateActionPlan,
    getIndustryInsights,
} from '@/lib/career-gps';

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

        let result;

        switch (action) {
            case 'analyze':
                if (!resume) {
                    return NextResponse.json({ error: 'Resume required' }, { status: 400 });
                }
                result = await analyzeCareer(resume, options);
                break;

            case 'action-plan':
                if (!resume || !body.targetPath) {
                    return NextResponse.json({ error: 'Resume and target path required' }, { status: 400 });
                }
                result = await generateActionPlan(resume, body.targetPath, options);
                break;

            case 'industry-insights':
                if (!body.industry) {
                    return NextResponse.json({ error: 'Industry required' }, { status: 400 });
                }
                result = await getIndustryInsights(body.industry, options);
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error('Career GPS API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Career analysis failed' },
            { status: 500 }
        );
    }
}
