'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileText,
    Sparkles,
    Loader2,
    Copy,
    Download,
    RefreshCw,
    Target,
    Building2,
    User,
    Briefcase,
    ArrowRight,
} from 'lucide-react';

export default function CoverLetterPage() {
    const { locale, t } = useLocale();
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [formData, setFormData] = useState({
        resume: '',
        company: '',
        position: '',
        jobDescription: '',
        tone: 'professional',
    });

    const tones = [
        { value: 'professional', label: { en: 'Professional', ar: 'احترافي' } },
        { value: 'enthusiastic', label: { en: 'Enthusiastic', ar: 'حماسي' } },
        { value: 'confident', label: { en: 'Confident', ar: 'واثق' } },
        { value: 'creative', label: { en: 'Creative', ar: 'إبداعي' } },
    ];

    // Mock resumes
    const resumes = [
        { id: '1', title: 'Software Engineer Resume' },
        { id: '2', title: 'Product Manager Resume' },
    ];

    const handleGenerate = async () => {
        if (!formData.company || !formData.position) {
            toast.error(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
            return;
        }

        setIsGenerating(true);

        // Simulate AI generation
        await new Promise((r) => setTimeout(r, 2500));

        const generatedLetter = locale === 'ar'
            ? `السادة ${formData.company} المحترمين،

أتقدم بطلبي لشغل وظيفة ${formData.position} في شركتكم الموقرة. بخبرتي الواسعة في مجال التقنية وشغفي بالابتكار، أعتقد أنني المرشح المثالي لهذا المنصب.

خلال مسيرتي المهنية، قمت بتطوير حلول برمجية متكاملة أدت إلى تحسين الأداء وزيادة الإنتاجية. أتمتع بمهارات قوية في حل المشكلات والعمل ضمن فريق، وأسعى دائماً للتعلم والتطور المستمر.

أتطلع لمناقشة كيف يمكنني المساهمة في نجاح ${formData.company}. شكراً لكم على وقتكم واهتمامكم.

مع خالص التقدير،
[اسمك]`
            : `Dear ${formData.company} Hiring Team,

I am writing to express my strong interest in the ${formData.position} position at ${formData.company}. With my extensive background in technology and passion for innovation, I believe I would be an excellent addition to your team.

Throughout my career, I have developed comprehensive solutions that improved performance and increased productivity. I possess strong problem-solving skills and thrive in collaborative environments, constantly seeking opportunities for growth and learning.

I am excited about the opportunity to contribute to ${formData.company}'s continued success. Thank you for considering my application. I look forward to discussing how my skills and experience align with your needs.

Best regards,
[Your Name]`;

        setCoverLetter(generatedLetter);
        setIsGenerating(false);
        toast.success(locale === 'ar' ? 'تم إنشاء الخطاب بنجاح!' : 'Cover letter generated!');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        toast.success(locale === 'ar' ? 'تم النسخ!' : 'Copied to clipboard!');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    {locale === 'ar' ? 'منشئ خطاب التقديم' : 'Cover Letter Generator'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {locale === 'ar'
                        ? 'أنشئ خطابات تقديم مخصصة باستخدام الذكاء الاصطناعي'
                        : 'Generate personalized cover letters using AI'}
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Input Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            {locale === 'ar' ? 'تفاصيل الوظيفة' : 'Job Details'}
                        </CardTitle>
                        <CardDescription>
                            {locale === 'ar'
                                ? 'أدخل معلومات الوظيفة لإنشاء خطاب مخصص'
                                : 'Enter job information to generate a tailored letter'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>{locale === 'ar' ? 'اختر السيرة الذاتية' : 'Select Resume'}</Label>
                            <Select
                                value={formData.resume}
                                onValueChange={(value) => setFormData({ ...formData, resume: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={locale === 'ar' ? 'اختر سيرة ذاتية' : 'Choose a resume'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {resumes.map((resume) => (
                                        <SelectItem key={resume.id} value={resume.id}>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {resume.title}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    <Building2 className="h-4 w-4 inline me-1" />
                                    {locale === 'ar' ? 'اسم الشركة' : 'Company Name'}
                                </Label>
                                <Input
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder={locale === 'ar' ? 'مثال: شركة تك' : 'e.g., Tech Corp'}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    <Briefcase className="h-4 w-4 inline me-1" />
                                    {locale === 'ar' ? 'المنصب' : 'Position'}
                                </Label>
                                <Input
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder={locale === 'ar' ? 'مثال: مهندس برمجيات' : 'e.g., Software Engineer'}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'ar' ? 'وصف الوظيفة (اختياري)' : 'Job Description (optional)'}</Label>
                            <Textarea
                                value={formData.jobDescription}
                                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                placeholder={
                                    locale === 'ar'
                                        ? 'الصق وصف الوظيفة لتخصيص الخطاب'
                                        : 'Paste the job description to personalize the letter'
                                }
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'ar' ? 'نبرة الخطاب' : 'Letter Tone'}</Label>
                            <Select
                                value={formData.tone}
                                onValueChange={(value) => setFormData({ ...formData, tone: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {tones.map((tone) => (
                                        <SelectItem key={tone.value} value={tone.value}>
                                            {tone.label[locale]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full"
                            size="lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-5 w-5 me-2 animate-spin" />
                                    {locale === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 me-2" />
                                    {locale === 'ar' ? 'إنشاء الخطاب' : 'Generate Cover Letter'}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Generated Letter */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                {locale === 'ar' ? 'خطاب التقديم' : 'Cover Letter'}
                            </CardTitle>
                            {coverLetter && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleGenerate}>
                                        <RefreshCw className="h-4 w-4 me-1" />
                                        {locale === 'ar' ? 'إعادة' : 'Regenerate'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleCopy}>
                                        <Copy className="h-4 w-4 me-1" />
                                        {locale === 'ar' ? 'نسخ' : 'Copy'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!coverLetter ? (
                            <div className="text-center py-16 border rounded-lg border-dashed">
                                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-medium mb-2">
                                    {locale === 'ar' ? 'لا يوجد خطاب بعد' : 'No letter yet'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {locale === 'ar'
                                        ? 'املأ التفاصيل وانقر إنشاء'
                                        : 'Fill in the details and click generate'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    className="min-h-[400px] font-mono text-sm"
                                />
                                <div className="flex gap-2">
                                    <Button className="flex-1">
                                        <Download className="h-4 w-4 me-2" />
                                        {locale === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        <Download className="h-4 w-4 me-2" />
                                        {locale === 'ar' ? 'تحميل DOCX' : 'Download DOCX'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tips */}
            <Card className="bg-muted/30">
                <CardContent className="py-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {locale === 'ar' ? 'نصائح لخطاب تقديم ناجح' : 'Cover Letter Tips'}
                    </h3>
                    <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            {locale === 'ar'
                                ? 'خصص الخطاب لكل وظيفة'
                                : 'Customize for each job application'}
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            {locale === 'ar'
                                ? 'استخدم أمثلة محددة من خبراتك'
                                : 'Use specific examples from your experience'}
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            {locale === 'ar'
                                ? 'اظهر فهمك للشركة'
                                : 'Show understanding of the company'}
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            {locale === 'ar'
                                ? 'اجعله مختصراً ومركزاً'
                                : 'Keep it concise and focused'}
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
