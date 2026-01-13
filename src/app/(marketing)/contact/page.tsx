'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Loader2,
    MessageSquare,
    Clock,
    Building2,
} from 'lucide-react';

export default function ContactPage() {
    const { locale } = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success(
            locale === 'ar'
                ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
                : 'Message sent successfully! We will get back to you soon.'
        );

        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsLoading(false);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: locale === 'ar' ? 'البريد الإلكتروني' : 'Email',
            value: 'info@seera-sa.com',
            description: locale === 'ar' ? 'نرد خلال 24 ساعة' : 'We respond within 24 hours',
        },
        {
            icon: Phone,
            title: locale === 'ar' ? 'الهاتف' : 'Phone',
            value: '+966 11 234 5678',
            description: locale === 'ar' ? 'الأحد - الخميس, 9ص - 6م' : 'Sun - Thu, 9am - 6pm',
        },
        {
            icon: MapPin,
            title: locale === 'ar' ? 'العنوان' : 'Address',
            value: locale === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
            description: locale === 'ar' ? 'طريق الملك فهد' : 'King Fahd Road',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 bg-gradient-to-b from-primary/5 via-background to-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Badge variant="secondary" className="mb-6">
                        <MessageSquare className="h-4 w-4 me-2" />
                        {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {locale === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help?'}
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {locale === 'ar'
                            ? 'فريقنا جاهز للإجابة على أسئلتك ومساعدتك في رحلتك المهنية.'
                            : 'Our team is ready to answer your questions and help you on your career journey.'}
                    </p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-12 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        {contactInfo.map((info) => (
                            <Card key={info.title} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <info.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-1">{info.title}</h3>
                                    <p className="text-primary font-medium mb-1">{info.value}</p>
                                    <p className="text-sm text-muted-foreground">{info.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                {locale === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}
                            </h2>
                            <p className="text-muted-foreground">
                                {locale === 'ar'
                                    ? 'املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن.'
                                    : 'Fill out the form below and we will get back to you as soon as possible.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{locale === 'ar' ? 'الاسم' : 'Name'}</Label>
                                    <Input
                                        id="name"
                                        placeholder={locale === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">{locale === 'ar' ? 'الموضوع' : 'Subject'}</Label>
                                <Input
                                    id="subject"
                                    placeholder={locale === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">{locale === 'ar' ? 'الرسالة' : 'Message'}</Label>
                                <Textarea
                                    id="message"
                                    placeholder={
                                        locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'
                                    }
                                    className="min-h-[150px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 me-2 animate-spin" />
                                        {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 me-2" />
                                        {locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ Link */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {locale === 'ar' ? 'تحتاج إجابة سريعة؟' : 'Need a quick answer?'}
                        </span>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <a href="/help">
                            {locale === 'ar' ? 'تصفح الأسئلة الشائعة' : 'Browse our FAQ'}
                        </a>
                    </Button>
                </div>
            </section>
        </div>
    );
}
