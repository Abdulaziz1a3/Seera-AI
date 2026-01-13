'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Target,
    Sparkles,
    FileText,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ArrowRight,
    Plus,
    TrendingUp,
    Briefcase,
    Building2,
    MapPin,
    DollarSign,
} from 'lucide-react';

// Mock job targets
const mockJobTargets = [
    {
        id: '1',
        company: 'Tech Corp',
        title: 'Senior Software Engineer',
        location: 'Riyadh',
        matchScore: 87,
        appliedResume: 'Software Engineer Resume',
        createdAt: new Date('2024-01-10'),
    },
    {
        id: '2',
        company: 'Startup Inc',
        title: 'Full Stack Developer',
        location: 'Dubai',
        matchScore: 72,
        appliedResume: null,
        createdAt: new Date('2024-01-08'),
    },
];

export default function JobTargetsPage() {
    const { locale, t } = useLocale();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResult, setAnalysisResult] = useState<null | {
        matchScore: number;
        keywords: { found: string[]; missing: string[] };
        suggestions: string[];
    }>(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            toast.error(locale === 'ar' ? 'يرجى إدخال وصف الوظيفة' : 'Please enter a job description');
            return;
        }

        setIsAnalyzing(true);

        // Simulate analysis
        await new Promise((r) => setTimeout(r, 2000));

        setAnalysisResult({
            matchScore: 78,
            keywords: {
                found: ['React', 'TypeScript', 'Node.js', 'API', 'Git'],
                missing: ['Kubernetes', 'Docker', 'CI/CD', 'AWS'],
            },
            suggestions: [
                locale === 'ar' ? 'أضف خبرة في Docker و Kubernetes' : 'Add experience with Docker and Kubernetes',
                locale === 'ar' ? 'اذكر مشاريع CI/CD' : 'Mention CI/CD projects',
                locale === 'ar' ? 'أضف شهادات AWS' : 'Add AWS certifications',
            ],
        });

        setIsAnalyzing(false);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500/10';
        if (score >= 60) return 'bg-amber-500/10';
        return 'bg-red-500/10';
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">{t.nav.jobTargets}</h1>
                <p className="text-muted-foreground mt-1">
                    {locale === 'ar'
                        ? 'حلل وصف الوظيفة وطابقه مع سيرتك الذاتية'
                        : 'Analyze job descriptions and match them with your resume'}
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Job Description Input */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            {locale === 'ar' ? 'تحليل وصف الوظيفة' : 'Analyze Job Description'}
                        </CardTitle>
                        <CardDescription>
                            {locale === 'ar'
                                ? 'الصق وصف الوظيفة لتحليل التطابق مع سيرتك'
                                : 'Paste the job description to analyze match with your resume'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>{locale === 'ar' ? 'وصف الوظيفة' : 'Job Description'}</Label>
                            <Textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder={
                                    locale === 'ar'
                                        ? 'الصق وصف الوظيفة هنا...'
                                        : 'Paste the job description here...'
                                }
                                className="min-h-[200px]"
                            />
                        </div>

                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !jobDescription.trim()}
                            className="w-full"
                            size="lg"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="h-5 w-5 me-2 animate-spin" />
                                    {locale === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 me-2" />
                                    {locale === 'ar' ? 'تحليل التطابق' : 'Analyze Match'}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Analysis Results */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            {locale === 'ar' ? 'نتائج التحليل' : 'Analysis Results'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!analysisResult ? (
                            <div className="text-center py-12">
                                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-medium mb-2">
                                    {locale === 'ar' ? 'لا توجد نتائج بعد' : 'No results yet'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {locale === 'ar'
                                        ? 'الصق وصف الوظيفة وانقر تحليل'
                                        : 'Paste a job description and click analyze'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Match Score */}
                                <div className="text-center">
                                    <div className="relative inline-flex">
                                        <svg className="w-28 h-28 transform -rotate-90">
                                            <circle cx="56" cy="56" r="48" fill="none" className="stroke-muted" strokeWidth="8" />
                                            <circle
                                                cx="56"
                                                cy="56"
                                                r="48"
                                                fill="none"
                                                className={analysisResult.matchScore >= 80 ? 'stroke-green-500' : analysisResult.matchScore >= 60 ? 'stroke-amber-500' : 'stroke-red-500'}
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(analysisResult.matchScore / 100) * 301} 301`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={`text-2xl font-bold ${getScoreColor(analysisResult.matchScore)}`}>
                                                {analysisResult.matchScore}%
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {locale === 'ar' ? 'نسبة التطابق' : 'Match Score'}
                                    </p>
                                </div>

                                <Separator />

                                {/* Keywords */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            {locale === 'ar' ? 'الكلمات المفتاحية الموجودة' : 'Keywords Found'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.keywords.found.map((keyword) => (
                                                <Badge key={keyword} variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            {locale === 'ar' ? 'الكلمات المفتاحية الناقصة' : 'Missing Keywords'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.keywords.missing.map((keyword) => (
                                                <Badge key={keyword} variant="secondary" className="bg-red-500/10 text-red-700 dark:text-red-400">
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Suggestions */}
                                <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        {locale === 'ar' ? 'اقتراحات التحسين' : 'Improvement Suggestions'}
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysisResult.suggestions.map((suggestion, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button className="w-full" asChild>
                                    <Link href="/dashboard/resumes">
                                        {locale === 'ar' ? 'تحسين السيرة الذاتية' : 'Optimize Resume'}
                                        <ArrowRight className="h-4 w-4 ms-2" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Previous Job Targets */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    {locale === 'ar' ? 'الوظائف المستهدفة السابقة' : 'Previous Job Targets'}
                </h2>

                {mockJobTargets.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium mb-2">
                                {locale === 'ar' ? 'لا توجد وظائف مستهدفة' : 'No job targets yet'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === 'ar'
                                    ? 'حلل وصف وظيفة لإضافتها هنا'
                                    : 'Analyze a job description to add it here'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {mockJobTargets.map((job) => (
                            <Card key={job.id} className="group hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{job.title}</h3>
                                                <p className="text-sm text-muted-foreground">{job.company}</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBg(job.matchScore)} ${getScoreColor(job.matchScore)}`}>
                                            {job.matchScore}%
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {job.location}
                                        </span>
                                    </div>

                                    {job.appliedResume ? (
                                        <Badge variant="secondary" className="text-xs">
                                            <FileText className="h-3 w-3 me-1" />
                                            {job.appliedResume}
                                        </Badge>
                                    ) : (
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Plus className="h-4 w-4 me-1" />
                                            {locale === 'ar' ? 'تخصيص سيرة' : 'Tailor Resume'}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
