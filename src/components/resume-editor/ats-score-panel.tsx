'use client';

import { useMemo } from 'react';
import {
    CheckCircle2,
    AlertTriangle,
    Info,
    XCircle,
    TrendingUp,
    Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { lintResume, type LintIssue, type LintResult } from '@/lib/ats-linter';
import type { Resume } from '@/lib/resume-schema';

interface ATSScorePanelProps {
    resume: Resume;
    score: number | null;
}

export function ATSScorePanel({ resume, score }: ATSScorePanelProps) {
    const lintResult: LintResult = useMemo(() => {
        return lintResume(resume, resume.language || 'en');
    }, [resume]);

    const displayScore = score ?? lintResult.score;

    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-500';
        if (s >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (s: number) => {
        if (s >= 80) return 'bg-green-500';
        if (s >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreLabel = (s: number) => {
        if (s >= 90) return 'Excellent';
        if (s >= 80) return 'Good';
        if (s >= 70) return 'Fair';
        if (s >= 60) return 'Needs Work';
        return 'Poor';
    };

    const getSeverityIcon = (severity: LintIssue['severity']) => {
        switch (severity) {
            case 'error':
                return <XCircle className="h-4 w-4 text-destructive" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-warning" />;
            case 'info':
                return <Info className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="space-y-4">
            {/* Score Overview */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-muted"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={`${(displayScore / 100) * 352} 352`}
                                    strokeLinecap="round"
                                    className={getScoreColor(displayScore)}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-bold ${getScoreColor(displayScore)}`}>
                                    {displayScore}
                                </span>
                                <span className="text-xs text-muted-foreground">ATS Score</span>
                            </div>
                        </div>
                        <Badge className={`mt-2 ${getScoreBg(displayScore)}`}>
                            {getScoreLabel(displayScore)}
                        </Badge>
                    </div>

                    {/* Score Breakdown */}
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Recruiter Score</span>
                            <span className="font-medium">{lintResult.recruiterScore}%</span>
                        </div>
                        <Progress value={lintResult.recruiterScore} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Issue Summary */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Issues Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-destructive/10 p-2">
                            <div className="text-lg font-bold text-destructive">{lintResult.summary.errors}</div>
                            <div className="text-xs text-muted-foreground">Errors</div>
                        </div>
                        <div className="rounded-lg bg-warning/10 p-2">
                            <div className="text-lg font-bold text-warning">{lintResult.summary.warnings}</div>
                            <div className="text-xs text-muted-foreground">Warnings</div>
                        </div>
                        <div className="rounded-lg bg-muted p-2">
                            <div className="text-lg font-bold">{lintResult.summary.info}</div>
                            <div className="text-xs text-muted-foreground">Tips</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Issues List */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Improvement Suggestions</CardTitle>
                    <CardDescription>Fix these issues to improve your ATS score</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {lintResult.issues.length === 0 ? (
                        <div className="text-center py-4">
                            <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No issues found! Your resume looks great.
                            </p>
                        </div>
                    ) : (
                        lintResult.issues.slice(0, 10).map((issue) => (
                            <div
                                key={issue.id}
                                className="flex gap-2 p-2 rounded-lg bg-muted/50"
                            >
                                {getSeverityIcon(issue.severity)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium">{issue.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {issue.description}
                                    </p>
                                    {issue.suggestion && (
                                        <div className="flex items-start gap-1 mt-1 text-xs text-primary">
                                            <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            <span>{issue.suggestion}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {lintResult.issues.length > 10 && (
                        <p className="text-center text-xs text-muted-foreground">
                            +{lintResult.issues.length - 10} more issues
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Tips */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Quick Tips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Use standard section headers (Experience, Education, Skills)
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Start bullet points with action verbs
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Include numbers and metrics where possible
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Match keywords from the job description
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Keep your resume to 1-2 pages
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
