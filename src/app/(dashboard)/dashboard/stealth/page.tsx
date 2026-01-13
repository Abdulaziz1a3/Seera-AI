'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
    Shield,
    ShieldCheck,
    ShieldOff,
    EyeOff,
    Building2,
    Plus,
    X,
    Lock,
    Unlock,
    User,
    Briefcase,
    MapPin,
    Calendar,
    Check,
    AlertTriangle,
    Search,
    Trash2,
    Eye,
} from 'lucide-react';

// Mock company database for autocomplete
const COMPANY_DATABASE = [
    'Aramco', 'STC', 'SABIC', 'Almarai', 'Al Rajhi Bank', 'SNB', 'Mobily',
    'Zain', 'Riyad Bank', 'SAMBA', 'Olayan Group', 'Abdul Latif Jameel',
    'Savola', 'Jarir', 'Extra', 'Panda', 'Careem', 'Noon', 'Tamara',
    'Foodics', 'Lucid', 'NEOM', 'Red Sea Global', 'Qiddiya', 'PIF',
];

export default function StealthModePage() {
    const { locale } = useLocale();
    const [stealthEnabled, setStealthEnabled] = useState(false);
    const [blockedCompanies, setBlockedCompanies] = useState<string[]>(['Aramco', 'STC']);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Anonymous profile settings
    const [anonymousSettings, setAnonymousSettings] = useState({
        hidePhoto: true,
        hideName: true,
        hideCurrentCompany: true,
        hideLinkedIn: true,
        genericCompanyName: 'Leading Technology Company',
    });

    // Generate anonymous candidate ID
    const candidateId = 'A7X2';

    const filteredSuggestions = COMPANY_DATABASE.filter(
        (company) =>
            company.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !blockedCompanies.includes(company)
    );

    const addCompany = (company: string) => {
        if (!blockedCompanies.includes(company)) {
            setBlockedCompanies([...blockedCompanies, company]);
            setSearchQuery('');
            setShowSuggestions(false);
            toast.success(
                locale === 'ar'
                    ? `تم حظر ${company} من رؤية ملفك`
                    : `${company} blocked from viewing your profile`
            );
        }
    };

    const removeCompany = (company: string) => {
        setBlockedCompanies(blockedCompanies.filter((c) => c !== company));
        toast.success(
            locale === 'ar'
                ? `تم إزالة ${company} من القائمة المحظورة`
                : `${company} removed from blocked list`
        );
    };

    const toggleStealth = () => {
        setStealthEnabled(!stealthEnabled);
        toast.success(
            stealthEnabled
                ? locale === 'ar'
                    ? 'تم إيقاف وضع التخفي'
                    : 'Stealth mode disabled'
                : locale === 'ar'
                    ? 'تم تفعيل وضع التخفي - أنت الآن مخفي!'
                    : 'Stealth mode enabled - You are now hidden!'
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="h-8 w-8 text-primary" />
                        {locale === 'ar' ? 'وضع التخفي' : 'Stealth Mode'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {locale === 'ar'
                            ? 'ابحث عن عمل دون أن يعرف صاحب العمل الحالي'
                            : 'Job hunt without your current employer knowing'}
                    </p>
                </div>

                {/* Main Toggle */}
                <div className="flex items-center gap-4">
                    <Badge
                        variant={stealthEnabled ? 'default' : 'secondary'}
                        className={`px-4 py-2 text-sm ${stealthEnabled ? 'bg-green-600' : ''}`}
                    >
                        {stealthEnabled ? (
                            <>
                                <ShieldCheck className="h-4 w-4 me-2" />
                                {locale === 'ar' ? 'محمي' : 'Protected'}
                            </>
                        ) : (
                            <>
                                <ShieldOff className="h-4 w-4 me-2" />
                                {locale === 'ar' ? 'مكشوف' : 'Exposed'}
                            </>
                        )}
                    </Badge>
                    <Switch
                        checked={stealthEnabled}
                        onCheckedChange={toggleStealth}
                        className="scale-125"
                    />
                </div>
            </div>

            {/* Warning Banner when disabled */}
            {!stealthEnabled && (
                <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                    <CardContent className="flex items-center gap-4 py-4">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                        <div>
                            <p className="font-medium text-amber-800 dark:text-amber-200">
                                {locale === 'ar'
                                    ? 'وضع التخفي معطل'
                                    : 'Stealth mode is disabled'}
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                {locale === 'ar'
                                    ? 'ملفك الشخصي مرئي لجميع الشركات بما في ذلك صاحب العمل الحالي'
                                    : 'Your profile is visible to all companies including your current employer'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Company Blacklist */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {locale === 'ar' ? 'الشركات المحظورة' : 'Blocked Companies'}
                        </CardTitle>
                        <CardDescription>
                            {locale === 'ar'
                                ? 'هذه الشركات لا يمكنها رؤية ملفك الشخصي'
                                : 'These companies cannot see your profile'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search & Add */}
                        <div className="relative">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={
                                    locale === 'ar' ? 'ابحث عن شركة لحظرها...' : 'Search company to block...'
                                }
                                className="ps-10"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(e.target.value.length > 0);
                                }}
                                onFocus={() => searchQuery && setShowSuggestions(true)}
                            />

                            {/* Suggestions Dropdown */}
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-48 overflow-auto">
                                    {filteredSuggestions.slice(0, 6).map((company) => (
                                        <button
                                            key={company}
                                            className="w-full px-4 py-2 text-start hover:bg-muted flex items-center justify-between"
                                            onClick={() => addCompany(company)}
                                        >
                                            <span>{company}</span>
                                            <Plus className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Blocked List */}
                        <div className="space-y-2">
                            {blockedCompanies.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    {locale === 'ar'
                                        ? 'لم تحظر أي شركات بعد'
                                        : 'No companies blocked yet'}
                                </p>
                            ) : (
                                blockedCompanies.map((company) => (
                                    <div
                                        key={company}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                <EyeOff className="h-4 w-4 text-red-600" />
                                            </div>
                                            <span className="font-medium">{company}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeCompany(company)}
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>

                        <Separator />

                        <p className="text-xs text-muted-foreground">
                            {locale === 'ar'
                                ? `${blockedCompanies.length} شركات محظورة من رؤية ملفك`
                                : `${blockedCompanies.length} companies blocked from viewing your profile`}
                        </p>
                    </CardContent>
                </Card>

                {/* Anonymous Profile Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <EyeOff className="h-5 w-5" />
                            {locale === 'ar' ? 'معاينة الملف المخفي' : 'Anonymous Profile Preview'}
                        </CardTitle>
                        <CardDescription>
                            {locale === 'ar'
                                ? 'هكذا يظهر ملفك للمسؤولين عن التوظيف'
                                : 'This is how recruiters see your profile'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-xl p-6 bg-gradient-to-br from-muted/50 to-muted">
                            {/* Anonymous Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                        🥷
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold">
                                            Candidate #{candidateId}
                                        </h3>
                                        <Badge variant="secondary" className="text-xs">
                                            <Lock className="h-3 w-3 me-1" />
                                            {locale === 'ar' ? 'هوية مخفية' : 'Identity Hidden'}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">Senior Software Engineer</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-3 w-3" />
                                            {anonymousSettings.genericCompanyName}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            Riyadh, SA
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* What's Visible */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    {locale === 'ar' ? 'معلومات مرئية:' : 'Visible Information:'}
                                </h4>
                                <div className="grid gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span>7 years experience</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span>Python, React, AWS, Team Leadership</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span>Bachelor's in Computer Science</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* What's Hidden */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                                    <EyeOff className="h-4 w-4" />
                                    {locale === 'ar' ? 'معلومات مخفية:' : 'Hidden Information:'}
                                </h4>
                                <div className="grid gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-red-500" />
                                        <span className="line-through">Your real name</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-red-500" />
                                        <span className="line-through">Current company name</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-red-500" />
                                        <span className="line-through">Profile photo</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-red-500" />
                                        <span className="line-through">LinkedIn profile</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reveal CTA */}
                        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">
                                {locale === 'ar'
                                    ? 'عندما يرسل لك مسؤول توظيف رسالة، يمكنك الكشف عن هويتك له فقط.'
                                    : 'When a recruiter messages you, you can reveal your identity to them only.'}
                            </p>
                            <Button size="sm" variant="outline" disabled>
                                <Unlock className="h-4 w-4 me-2" />
                                {locale === 'ar' ? 'كشف الهوية' : 'Reveal Identity'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Privacy Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        {locale === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {locale === 'ar' ? 'إخفاء الاسم' : 'Hide Name'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {locale === 'ar' ? 'يظهر كـ "مرشح #XXXX"' : 'Shows as "Candidate #XXXX"'}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={anonymousSettings.hideName}
                                onCheckedChange={(v) =>
                                    setAnonymousSettings({ ...anonymousSettings, hideName: v })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {locale === 'ar' ? 'إخفاء الشركة الحالية' : 'Hide Current Company'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {locale === 'ar' ? 'يظهر كـ "شركة رائدة"' : 'Shows as "Leading Company"'}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={anonymousSettings.hideCurrentCompany}
                                onCheckedChange={(v) =>
                                    setAnonymousSettings({ ...anonymousSettings, hideCurrentCompany: v })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {locale === 'ar' ? 'إخفاء الصورة' : 'Hide Photo'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {locale === 'ar' ? 'يظهر رمز مجهول' : 'Shows anonymous avatar'}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={anonymousSettings.hidePhoto}
                                onCheckedChange={(v) =>
                                    setAnonymousSettings({ ...anonymousSettings, hidePhoto: v })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {locale === 'ar' ? 'إخفاء LinkedIn' : 'Hide LinkedIn'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {locale === 'ar' ? 'لا يظهر رابط LinkedIn' : 'LinkedIn link not shown'}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={anonymousSettings.hideLinkedIn}
                                onCheckedChange={(v) =>
                                    setAnonymousSettings({ ...anonymousSettings, hideLinkedIn: v })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button size="lg" onClick={() => toast.success(locale === 'ar' ? 'تم حفظ الإعدادات' : 'Settings saved')}>
                    {locale === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
                </Button>
            </div>
        </div>
    );
}
