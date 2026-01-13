import { NextRequest, NextResponse } from 'next/server';
import {
    generateInterviewQuestions,
    conductInterview,
    evaluateAnswer,
    generateInterviewerVoice,
    generateInterviewSummary,
} from '@/lib/interview-ai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...params } = body;

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API not configured' },
                { status: 500 }
            );
        }

        let result;

        switch (action) {
            case 'generate-questions':
                result = await generateInterviewQuestions(params.context, params.count);
                break;

            case 'conduct-interview':
                result = await conductInterview(
                    params.messages,
                    params.context,
                    params.currentQuestion
                );
                break;

            case 'evaluate-answer':
                result = await evaluateAnswer(
                    params.question,
                    params.answer,
                    params.context
                );
                break;

            case 'generate-summary':
                result = await generateInterviewSummary(params.questions, params.context);
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error('Interview API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Interview API failed' },
            { status: 500 }
        );
    }
}
