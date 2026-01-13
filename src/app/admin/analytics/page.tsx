'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    Eye,
    Download,
    DollarSign,
    Calendar,
    BarChart3,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
    const { locale } = useLocale();
    const [period, setPeriod] = useState('30d');

    const stats = [
        {
            label: locale === 'ar' ? 'مشاهدات الصفحات' : 'Page Views',
            value: '234,567',
            change: '+18.2%',
            trend: 'up',
            icon: Eye,
        },
        {
            label: locale === 'ar' ? 'مستخدمين جدد' : 'New Users',
            value: '4,521',
            change: '+12.5%',
            trend: 'up',
            icon: Users,
        },
        {
            label: locale === 'ar' ? 'سير ذاتية منشأة' : 'Resumes Created',
            value: '8,932',
            change: '+23.1%',
            trend: 'up',
            icon: FileText,
        },
        {
            label: locale === 'ar' ? 'تحميلات' : 'Downloads',
            value: '5,678',
            change: '-3.2%',
            trend: 'down',
            icon: Download,
        },
    ];

    const topPages = [
        { path: '/', views: 45678, change: '+12%' },
        { path: '/templates', views: 23456, change: '+8%' },
        { path: '/pricing', views: 12345, change: '+15%' },
        { path: '/blog', views: 8901, change: '+22%' },
        { path: '/dashboard', views: 7654, change: '+5%' },
    ];

    const conversionFunnel = [
        { stage: locale === 'ar' ? 'زوار' : 'Visitors', count: 50000, rate: 100 },
        { stage: locale === 'ar' ? 'تسجيلات' : 'Signups', count: 5000, rate: 10 },
        { stage: locale === 'ar' ? 'سير منشأة' : 'Resumes Created', count: 3500, rate: 70 },
        { stage: locale === 'ar' ? 'تحميلات' : 'Downloads', count: 2800, rate: 80 },
        { stage: locale === 'ar' ? 'اشتراكات' : 'Subscriptions', count: 350, rate: 12.5 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {locale === 'ar' ? 'التحليلات' : 'Analytics'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {locale === 'ar' ? 'تتبع أداء المنصة' : 'Track platform performance'}
                    </p>
                </div>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]">
                        <Calendar className="h-4 w-4 me-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">{locale === 'ar' ? '7 أيام' : 'Last 7 days'}</SelectItem>
                        <SelectItem value="30d">{locale === 'ar' ? '30 يوم' : 'Last 30 days'}</SelectItem>
                        <SelectItem value="90d">{locale === 'ar' ? '90 يوم' : 'Last 90 days'}</SelectItem>
                        <SelectItem value="1y">{locale === 'ar' ? 'سنة' : 'Last year'}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <stat.icon className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Chart Placeholder */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            {locale === 'ar' ? 'الإحصائيات اليومية' : 'Daily Statistics'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                            <div className="text-center text-muted-foreground">
                                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>{locale === 'ar' ? 'الرسم البياني قيد التطوير' : 'Chart visualization coming soon'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Pages */}
                <Card>
                    <CardHeader>
                        <CardTitle>{locale === 'ar' ? 'الصفحات الأكثر زيارة' : 'Top Pages'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPages.map((page, i) => (
                                <div key={page.path} className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{page.path}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {page.views.toLocaleString()} {locale === 'ar' ? 'مشاهدة' : 'views'}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="text-green-600">
                                        {page.change}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle>{locale === 'ar' ? 'قمع التحويل' : 'Conversion Funnel'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {conversionFunnel.map((stage, i) => (
                                <div key={stage.stage}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{stage.stage}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {stage.count.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${stage.rate}%` }}
                                        />
                                    </div>
                                    {i < conversionFunnel.length - 1 && (
                                        <p className="text-xs text-muted-foreground mt-1 text-end">
                                            {stage.rate}% {locale === 'ar' ? 'تحويل' : 'conversion'}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        {locale === 'ar' ? 'نظرة على الإيرادات' : 'Revenue Overview'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                {locale === 'ar' ? 'إيرادات الشهر' : 'This Month'}
                            </p>
                            <p className="text-2xl font-bold mt-1">$48,239</p>
                            <p className="text-sm text-green-500 mt-1">+12.5%</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                {locale === 'ar' ? 'متوسط القيمة' : 'Avg. Order Value'}
                            </p>
                            <p className="text-2xl font-bold mt-1">$29.99</p>
                            <p className="text-sm text-green-500 mt-1">+3.2%</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                {locale === 'ar' ? 'إجمالي الاشتراكات' : 'Total Subscriptions'}
                            </p>
                            <p className="text-2xl font-bold mt-1">2,847</p>
                            <p className="text-sm text-green-500 mt-1">+8.1%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
