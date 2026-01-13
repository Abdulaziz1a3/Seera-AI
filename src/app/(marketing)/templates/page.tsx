'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Eye,
    Download,
    Star,
    Check,
    Sparkles,
    Briefcase,
    GraduationCap,
    Code,
    Palette,
    Building2,
    Stethoscope,
} from 'lucide-react';

// Template definitions
const templates = [
    {
        id: 'professional',
        name: { en: 'Professional', ar: 'احترافي' },
        description: {
            en: 'Clean and modern design perfect for corporate roles',
            ar: 'تصميم نظيف وعصري مثالي للأدوار المؤسسية',
        },
        category: 'corporate',
        isPremium: false,
        rating: 4.9,
        uses: 12500,
        color: 'from-slate-600 to-slate-800',
        preview: null,
    },
    {
        id: 'executive',
        name: { en: 'Executive', ar: 'تنفيذي' },
        description: {
            en: 'Elegant template for senior leadership positions',
            ar: 'قالب أنيق للمناصب القيادية العليا',
        },
        category: 'corporate',
        isPremium: true,
        rating: 4.8,
        uses: 8200,
        color: 'from-amber-600 to-amber-800',
        preview: null,
    },
    {
        id: 'creative',
        name: { en: 'Creative', ar: 'إبداعي' },
        description: {
            en: 'Stand out with a unique, artistic layout',
            ar: 'تميّز بتخطيط فني فريد',
        },
        category: 'creative',
        isPremium: true,
        rating: 4.7,
        uses: 6800,
        color: 'from-purple-600 to-pink-600',
        preview: null,
    },
    {
        id: 'minimalist',
        name: { en: 'Minimalist', ar: 'بسيط' },
        description: {
            en: 'Simple and elegant with focus on content',
            ar: 'بسيط وأنيق مع التركيز على المحتوى',
        },
        category: 'corporate',
        isPremium: false,
        rating: 4.8,
        uses: 15600,
        color: 'from-gray-400 to-gray-600',
        preview: null,
    },
    {
        id: 'tech',
        name: { en: 'Tech Pro', ar: 'تقني محترف' },
        description: {
            en: 'Designed for software engineers and developers',
            ar: 'مصمم لمهندسي البرمجيات والمطورين',
        },
        category: 'technical',
        isPremium: false,
        rating: 4.9,
        uses: 18300,
        color: 'from-blue-600 to-cyan-600',
        preview: null,
    },
    {
        id: 'academic',
        name: { en: 'Academic', ar: 'أكاديمي' },
        description: {
            en: 'Perfect for researchers and educators',
            ar: 'مثالي للباحثين والمعلمين',
        },
        category: 'academic',
        isPremium: false,
        rating: 4.6,
        uses: 5400,
        color: 'from-emerald-600 to-teal-600',
        preview: null,
    },
    {
        id: 'healthcare',
        name: { en: 'Healthcare', ar: 'الرعاية الصحية' },
        description: {
            en: 'Tailored for medical professionals',
            ar: 'مصمم خصيصاً للمهنيين الطبيين',
        },
        category: 'medical',
        isPremium: true,
        rating: 4.8,
        uses: 4200,
        color: 'from-red-500 to-rose-600',
        preview: null,
    },
    {
        id: 'modern',
        name: { en: 'Modern', ar: 'حديث' },
        description: {
            en: 'Contemporary design with bold accents',
            ar: 'تصميم معاصر مع لمسات جريئة',
        },
        category: 'creative',
        isPremium: true,
        rating: 4.7,
        uses: 9100,
        color: 'from-indigo-600 to-violet-600',
        preview: null,
    },
];

const categories = [
    { id: 'all', name: { en: 'All Templates', ar: 'جميع القوالب' }, icon: Sparkles },
    { id: 'corporate', name: { en: 'Corporate', ar: 'مؤسسي' }, icon: Building2 },
    { id: 'creative', name: { en: 'Creative', ar: 'إبداعي' }, icon: Palette },
    { id: 'technical', name: { en: 'Technical', ar: 'تقني' }, icon: Code },
    { id: 'academic', name: { en: 'Academic', ar: 'أكاديمي' }, icon: GraduationCap },
    { id: 'medical', name: { en: 'Medical', ar: 'طبي' }, icon: Stethoscope },
];

export default function TemplatesPage() {
    const { locale, t } = useLocale();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

    const filteredTemplates =
        selectedCategory === 'all'
            ? templates
            : templates.filter((t) => t.category === selectedCategory);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Badge variant="secondary" className="mb-6">
                        <Sparkles className="h-4 w-4 me-2" />
                        {locale === 'ar' ? '8 قوالب احترافية' : '8 Professional Templates'}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        {locale === 'ar' ? (
                            <>
                                قوالب سيرة ذاتية <span className="text-primary">متوافقة مع ATS</span>
                            </>
                        ) : (
                            <>
                                <span className="text-primary">ATS-Friendly</span> Resume Templates
                            </>
                        )}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        {locale === 'ar'
                            ? 'قوالب احترافية صممها خبراء التوظيف. كل قالب مُحسّن لتجاوز أنظمة تتبع المتقدمين.'
                            : 'Professional templates designed by hiring experts. Every template is optimized to pass Applicant Tracking Systems.'}
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                        {[
                            locale === 'ar' ? 'متوافق مع ATS' : 'ATS Compatible',
                            locale === 'ar' ? 'قابل للتخصيص' : 'Fully Customizable',
                            locale === 'ar' ? 'دعم RTL' : 'RTL Support',
                            locale === 'ar' ? 'تصدير متعدد' : 'Multi-format Export',
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-1">
                                <Check className="h-4 w-4 text-primary" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Template Gallery */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(category.id)}
                                className="gap-2"
                            >
                                <category.icon className="h-4 w-4" />
                                {category.name[locale]}
                            </Button>
                        ))}
                    </div>

                    {/* Templates Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredTemplates.map((template) => (
                            <Card
                                key={template.id}
                                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                onMouseEnter={() => setHoveredTemplate(template.id)}
                                onMouseLeave={() => setHoveredTemplate(null)}
                            >
                                {/* Preview */}
                                <div
                                    className={`relative aspect-[3/4] bg-gradient-to-br ${template.color} flex items-center justify-center`}
                                >
                                    {/* Premium Badge */}
                                    {template.isPremium && (
                                        <Badge className="absolute top-3 end-3 bg-amber-500 gap-1">
                                            <Star className="h-3 w-3 fill-current" />
                                            PRO
                                        </Badge>
                                    )}

                                    {/* Template Preview Mockup */}
                                    <div className="w-3/4 h-4/5 bg-white rounded-lg shadow-2xl p-4 transform group-hover:scale-105 transition-transform">
                                        <div className="h-full flex flex-col gap-2">
                                            <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                            <div className="h-2 w-3/4 bg-gray-100 rounded" />
                                            <div className="h-px bg-gray-200 my-2" />
                                            <div className="space-y-1 flex-1">
                                                {[...Array(6)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="h-1.5 bg-gray-100 rounded"
                                                        style={{ width: `${60 + Math.random() * 40}%` }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div
                                        className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity ${hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    >
                                        <Button size="sm" variant="secondary">
                                            <Eye className="h-4 w-4 me-1" />
                                            {locale === 'ar' ? 'معاينة' : 'Preview'}
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href={`/dashboard/resumes/new?template=${template.id}`}>
                                                {locale === 'ar' ? 'استخدم' : 'Use'}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Info */}
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold">{template.name[locale]}</h3>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            {template.rating}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {template.description[locale]}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            {template.uses.toLocaleString()} {locale === 'ar' ? 'استخدام' : 'uses'}
                                        </span>
                                        {template.isPremium ? (
                                            <Badge variant="outline" className="text-xs">
                                                {locale === 'ar' ? 'مميز' : 'Premium'}
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-xs">
                                                {locale === 'ar' ? 'مجاني' : 'Free'}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {locale === 'ar' ? 'جاهز لبناء سيرتك الذاتية؟' : 'Ready to Build Your Resume?'}
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        {locale === 'ar'
                            ? 'اختر قالباً وابدأ في إنشاء سيرتك الذاتية الاحترافية في دقائق.'
                            : 'Choose a template and start creating your professional resume in minutes.'}
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/register">
                            {locale === 'ar' ? 'ابدأ مجاناً' : 'Get Started Free'}
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
