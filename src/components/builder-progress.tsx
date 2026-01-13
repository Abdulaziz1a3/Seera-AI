'use client';

import { useLocale } from '@/components/providers/locale-provider';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

interface BuilderProgressProps {
    currentSection: string;
    sections: { id: string; label: string; labelAr: string }[];
    completedSections: string[];
}

const defaultSections = [
    { id: 'contact', label: 'Contact', labelAr: 'التواصل' },
    { id: 'summary', label: 'Summary', labelAr: 'الملخص' },
    { id: 'experience', label: 'Experience', labelAr: 'الخبرات' },
    { id: 'education', label: 'Education', labelAr: 'التعليم' },
    { id: 'skills', label: 'Skills', labelAr: 'المهارات' },
];

export function BuilderProgress({
    currentSection,
    sections = defaultSections,
    completedSections,
}: BuilderProgressProps) {
    const { locale } = useLocale();

    const totalSections = sections.length;
    const completedCount = completedSections.length;
    const progressPercent = Math.round((completedCount / totalSections) * 100);

    const currentIndex = sections.findIndex(s => s.id === currentSection);

    return (
        <div className="space-y-3 p-4 border-b bg-card">
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
                <Progress value={progressPercent} className="flex-1 h-2" />
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {progressPercent}%
                </span>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between">
                {sections.map((section, index) => {
                    const isCompleted = completedSections.includes(section.id);
                    const isCurrent = section.id === currentSection;

                    return (
                        <div key={section.id} className="flex flex-col items-center gap-1">
                            <div
                                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isCurrent
                                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                                            : 'bg-muted text-muted-foreground'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span
                                className={`
                  text-xs hidden sm:block
                  ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}
                `}
                            >
                                {locale === 'ar' ? section.labelAr : section.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Current Step Label (Mobile) */}
            <div className="sm:hidden text-center text-sm text-muted-foreground">
                {locale === 'ar' ? 'الخطوة' : 'Step'} {currentIndex + 1} {locale === 'ar' ? 'من' : 'of'} {totalSections}:{' '}
                <span className="font-medium text-foreground">
                    {locale === 'ar'
                        ? sections[currentIndex]?.labelAr
                        : sections[currentIndex]?.label
                    }
                </span>
            </div>
        </div>
    );
}
