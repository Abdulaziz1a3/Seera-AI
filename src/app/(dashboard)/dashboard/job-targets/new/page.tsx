'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Target,
    Sparkles,
    Loader2,
    FileText,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function NewJobTargetPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [selectedResume, setSelectedResume] = useState('');
    const [analysis, setAnalysis] = useState<{
        matchScore: number;
        matchingKeywords: string[];
        missingKeywords: string[];
        suggestions: string[];
    } | null>(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            toast.error('Please paste a job description');
            return;
        }

        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/ai/analyze-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobDescription,
                    resumeId: selectedResume,
                }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();
            setAnalysis(result);
            setStep(3);
        } catch (error) {
            toast.error('Failed to analyze. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/job-targets"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Job Targets
                </Link>
                <h1 className="text-3xl font-bold">Target a Job</h1>
                <p className="text-muted-foreground mt-1">
                    Paste a job description to analyze how well your resume matches and get recommendations.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`h-0.5 w-12 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                    </div>
                ))}
                <span className="ml-4 text-sm text-muted-foreground">
                    {step === 1 && 'Job Details'}
                    {step === 2 && 'Select Resume'}
                    {step === 3 && 'Analysis Results'}
                </span>
            </div>

            {/* Step 1: Job Details */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                        <CardDescription>
                            Paste the job description you want to target
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name</Label>
                                <Input
                                    id="company"
                                    placeholder="e.g., Google"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    placeholder="e.g., Senior Software Engineer"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Paste the full job description here..."
                                className="min-h-[300px]"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Include all requirements, qualifications, and responsibilities for best results.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Select Resume */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select Resume</CardTitle>
                        <CardDescription>
                            Choose which resume to analyze against this job
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select value={selectedResume} onValueChange={setSelectedResume}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a resume" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* TODO: Fetch user's resumes */}
                                <SelectItem value="resume-1">Software Engineer Resume</SelectItem>
                                <SelectItem value="resume-2">Product Manager Resume</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="rounded-lg border p-4 bg-muted/30">
                            <div className="flex items-start gap-3">
                                <Target className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-medium">What we'll analyze:</h4>
                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                        <li>• Match score (0-100%)</li>
                                        <li>• Keywords you have vs. keywords you're missing</li>
                                        <li>• Specific suggestions to improve your match</li>
                                        <li>• Skills gap analysis</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Analysis Results */}
            {step === 3 && analysis && (
                <div className="space-y-6">
                    {/* Score Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {company} - {position}
                                    </h2>
                                    <p className="text-muted-foreground">Match Analysis</p>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`text-4xl font-bold ${analysis.matchScore >= 80
                                                ? 'text-green-500'
                                                : analysis.matchScore >= 60
                                                    ? 'text-yellow-500'
                                                    : 'text-red-500'
                                            }`}
                                    >
                                        {analysis.matchScore}%
                                    </div>
                                    <Badge
                                        variant={
                                            analysis.matchScore >= 80
                                                ? 'default'
                                                : analysis.matchScore >= 60
                                                    ? 'secondary'
                                                    : 'outline'
                                        }
                                    >
                                        {analysis.matchScore >= 80
                                            ? 'Strong Match'
                                            : analysis.matchScore >= 60
                                                ? 'Fair Match'
                                                : 'Needs Work'}
                                    </Badge>
                                </div>
                            </div>
                            <Progress
                                value={analysis.matchScore}
                                className="mt-4 h-3"
                                indicatorClassName={
                                    analysis.matchScore >= 80
                                        ? 'bg-green-500'
                                        : analysis.matchScore >= 60
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                }
                            />
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Matching Keywords */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-5 w-5" />
                                    Matching Keywords
                                </CardTitle>
                                <CardDescription>
                                    Skills and keywords you have that match the job
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.matchingKeywords.map((keyword) => (
                                        <Badge key={keyword} variant="default" className="bg-green-500">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Missing Keywords */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    Missing Keywords
                                </CardTitle>
                                <CardDescription>
                                    Skills to add to improve your match
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.missingKeywords.map((keyword) => (
                                        <Badge key={keyword} variant="outline" className="border-amber-500 text-amber-600">
                                            + {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Suggestions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Improvement Suggestions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {analysis.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="flex-1" asChild>
                                    <Link href={`/dashboard/resumes/${selectedResume}/edit`}>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Edit Resume with Suggestions
                                    </Link>
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Target className="h-4 w-4 mr-2" />
                                    Save Job Target
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        if (step === 1) {
                            router.push('/dashboard/job-targets');
                        } else {
                            setStep((prev) => (prev - 1) as 1 | 2 | 3);
                        }
                    }}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {step < 3 && (
                    <Button
                        onClick={() => {
                            if (step === 1) {
                                if (!jobDescription.trim()) {
                                    toast.error('Please paste a job description');
                                    return;
                                }
                                setStep(2);
                            } else if (step === 2) {
                                handleAnalyze();
                            }
                        }}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                {step === 2 ? 'Analyze Match' : 'Continue'}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
