'use client';

import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Award, Link as LinkIcon, Calendar } from 'lucide-react';

interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
}

interface CertificationsEditorProps {
    data: Certification[];
    onChange: (data: Certification[]) => void;
}

export function CertificationsEditor({ data, onChange }: CertificationsEditorProps) {
    const { locale } = useLocale();

    const addCertification = () => {
        onChange([
            ...data,
            {
                id: crypto.randomUUID(),
                name: '',
                issuer: '',
                date: '',
                credentialId: '',
            },
        ]);
    };

    const updateCertification = (id: string, field: keyof Certification, value: string) => {
        onChange(
            data.map((cert) =>
                cert.id === id ? { ...cert, [field]: value } : cert
            )
        );
    };

    const removeCertification = (id: string) => {
        onChange(data.filter((cert) => cert.id !== id));
    };

    // Common certifications for quick add
    const suggestedCerts = [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
        { name: 'Google Cloud Professional', issuer: 'Google' },
        { name: 'PMP', issuer: 'Project Management Institute' },
        { name: 'Scrum Master Certified', issuer: 'Scrum Alliance' },
        { name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        {locale === 'ar' ? 'الشهادات' : 'Certifications'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {locale === 'ar'
                            ? 'أضف شهاداتك المهنية والتقنية'
                            : 'Add your professional certifications'}
                    </p>
                </div>
                <Button onClick={addCertification}>
                    <Plus className="h-4 w-4 me-2" />
                    {locale === 'ar' ? 'إضافة شهادة' : 'Add Certification'}
                </Button>
            </div>

            {data.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-8 text-center">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            {locale === 'ar'
                                ? 'لم تضف أي شهادات بعد'
                                : 'No certifications added yet'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {suggestedCerts.slice(0, 3).map((cert) => (
                                <Button
                                    key={cert.name}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        onChange([
                                            ...data,
                                            {
                                                id: crypto.randomUUID(),
                                                name: cert.name,
                                                issuer: cert.issuer,
                                                date: '',
                                                credentialId: '',
                                            },
                                        ]);
                                    }}
                                >
                                    <Plus className="h-3 w-3 me-1" />
                                    {cert.name}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {data.map((cert, index) => (
                        <Card key={cert.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Award className="h-4 w-4 text-primary" />
                                        {locale === 'ar' ? `شهادة ${index + 1}` : `Certification ${index + 1}`}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeCertification(cert.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>{locale === 'ar' ? 'اسم الشهادة *' : 'Certification Name *'}</Label>
                                        <Input
                                            value={cert.name}
                                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                            placeholder={locale === 'ar' ? 'اسم الشهادة' : 'Certification Name'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{locale === 'ar' ? 'الجهة المانحة' : 'Issuing Organization'}</Label>
                                        <Input
                                            value={cert.issuer}
                                            onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                            placeholder={locale === 'ar' ? 'الجهة المانحة' : 'e.g., Google, AWS'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{locale === 'ar' ? 'تاريخ الحصول' : 'Date Obtained'}</Label>
                                        <Input
                                            type="month"
                                            value={cert.date}
                                            onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{locale === 'ar' ? 'رقم الشهادة' : 'Credential ID'}</Label>
                                        <Input
                                            value={cert.credentialId}
                                            onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                            placeholder={locale === 'ar' ? 'رقم التعريف' : 'Credential ID'}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
