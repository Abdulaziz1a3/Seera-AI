// Production-Ready PDF Export for Seera AI
// Professional resume PDF generation with Arabic support and multiple templates

import { jsPDF } from 'jspdf';
import type { ResumeData } from '@/components/providers/resume-provider';
import { logger } from './logger';

export type TemplateStyle = 'professional' | 'modern' | 'executive' | 'creative' | 'minimalist' | 'ats-friendly';

interface PDFOptions {
    template: TemplateStyle;
    locale?: 'ar' | 'en';
    fontSize?: number;
    primaryColor?: string;
    showPhoto?: boolean;
    pageMargin?: number;
}

interface TemplateConfig {
    primary: string;
    secondary: string;
    accent: string;
    headerStyle: 'bold' | 'underline' | 'background';
    sectionSpacing: number;
    nameSize: number;
    sectionHeaderSize: number;
    bodySize: number;
}

// Template configurations
const templateConfigs: Record<TemplateStyle, TemplateConfig> = {
    professional: {
        primary: '#1e40af',
        secondary: '#1e293b',
        accent: '#3b82f6',
        headerStyle: 'underline',
        sectionSpacing: 8,
        nameSize: 24,
        sectionHeaderSize: 12,
        bodySize: 10,
    },
    modern: {
        primary: '#0891b2',
        secondary: '#0f172a',
        accent: '#06b6d4',
        headerStyle: 'bold',
        sectionSpacing: 7,
        nameSize: 26,
        sectionHeaderSize: 11,
        bodySize: 10,
    },
    executive: {
        primary: '#1f2937',
        secondary: '#111827',
        accent: '#4b5563',
        headerStyle: 'background',
        sectionSpacing: 10,
        nameSize: 28,
        sectionHeaderSize: 13,
        bodySize: 10.5,
    },
    creative: {
        primary: '#7c3aed',
        secondary: '#1e1b4b',
        accent: '#a78bfa',
        headerStyle: 'bold',
        sectionSpacing: 6,
        nameSize: 24,
        sectionHeaderSize: 11,
        bodySize: 9.5,
    },
    minimalist: {
        primary: '#374151',
        secondary: '#111827',
        accent: '#6b7280',
        headerStyle: 'underline',
        sectionSpacing: 8,
        nameSize: 22,
        sectionHeaderSize: 11,
        bodySize: 10,
    },
    'ats-friendly': {
        primary: '#000000',
        secondary: '#000000',
        accent: '#000000',
        headerStyle: 'bold',
        sectionSpacing: 8,
        nameSize: 20,
        sectionHeaderSize: 12,
        bodySize: 11,
    },
};

// Section header translations
const sectionHeaders: Record<string, { en: string; ar: string }> = {
    summary: { en: 'PROFESSIONAL SUMMARY', ar: 'الملخص المهني' },
    experience: { en: 'PROFESSIONAL EXPERIENCE', ar: 'الخبرة المهنية' },
    education: { en: 'EDUCATION', ar: 'التعليم' },
    skills: { en: 'SKILLS', ar: 'المهارات' },
    projects: { en: 'PROJECTS', ar: 'المشاريع' },
    certifications: { en: 'CERTIFICATIONS', ar: 'الشهادات' },
    languages: { en: 'LANGUAGES', ar: 'اللغات' },
    awards: { en: 'AWARDS', ar: 'الجوائز' },
    volunteering: { en: 'VOLUNTEERING', ar: 'العمل التطوعي' },
    references: { en: 'REFERENCES', ar: 'المراجع' },
};

// Format date for display
function formatDate(dateStr: string, locale: 'ar' | 'en' = 'en'): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
    } catch {
        return dateStr;
    }
}

// Get section header text
function getSectionHeader(section: string, locale: 'ar' | 'en'): string {
    return sectionHeaders[section]?.[locale] || section.toUpperCase();
}

// Hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
}

// PDF Generator class for better organization
class PDFResumeGenerator {
    private doc: jsPDF;
    private config: TemplateConfig;
    private locale: 'ar' | 'en';
    private pageWidth: number;
    private pageHeight: number;
    private margin: number;
    private contentWidth: number;
    private y: number;

    constructor(options: PDFOptions) {
        this.doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        this.config = templateConfigs[options.template];
        this.locale = options.locale || 'en';
        this.pageWidth = this.doc.internal.pageSize.getWidth();
        this.pageHeight = this.doc.internal.pageSize.getHeight();
        this.margin = options.pageMargin || 15;
        this.contentWidth = this.pageWidth - 2 * this.margin;
        this.y = this.margin;

        // Set document properties
        this.doc.setProperties({
            title: 'Resume - Seera AI',
            creator: 'Seera AI',
            author: 'Seera AI Resume Builder',
        });
    }

    // Check if we need a new page
    private checkPageBreak(requiredSpace: number = 20): void {
        if (this.y + requiredSpace > this.pageHeight - this.margin) {
            this.doc.addPage();
            this.y = this.margin;
        }
    }

    // Add text with word wrap
    private addWrappedText(text: string, lineHeight: number = 5): void {
        const lines = this.doc.splitTextToSize(text, this.contentWidth);
        lines.forEach((line: string) => {
            this.checkPageBreak();
            if (this.locale === 'ar') {
                // Right-align for Arabic
                const textWidth = this.doc.getTextWidth(line);
                this.doc.text(line, this.pageWidth - this.margin - textWidth, this.y);
            } else {
                this.doc.text(line, this.margin, this.y);
            }
            this.y += lineHeight;
        });
    }

    // Add section header
    private addSectionHeader(title: string): void {
        this.y += this.config.sectionSpacing / 2;
        this.checkPageBreak(15);

        const rgb = hexToRgb(this.config.primary);
        this.doc.setFontSize(this.config.sectionHeaderSize);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(rgb.r, rgb.g, rgb.b);

        const headerText = getSectionHeader(title, this.locale);

        if (this.config.headerStyle === 'background') {
            // Draw background
            this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
            this.doc.rect(this.margin, this.y - 3, this.contentWidth, 6, 'F');
            this.doc.setTextColor(255, 255, 255);
            this.doc.text(headerText, this.margin + 2, this.y + 1);
            this.y += 8;
        } else {
            this.doc.text(headerText, this.margin, this.y);
            this.y += 2;

            if (this.config.headerStyle === 'underline') {
                this.doc.setDrawColor(rgb.r, rgb.g, rgb.b);
                this.doc.setLineWidth(0.5);
                this.doc.line(this.margin, this.y, this.pageWidth - this.margin, this.y);
            }
            this.y += 5;
        }

        // Reset text color
        const secondaryRgb = hexToRgb(this.config.secondary);
        this.doc.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(this.config.bodySize);
    }

    // Add header (name and contact info)
    private addHeader(contact: ResumeData['contact']): void {
        // Name
        const primaryRgb = hexToRgb(this.config.primary);
        this.doc.setFontSize(this.config.nameSize);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);

        const name = contact.fullName || 'Your Name';
        if (this.locale === 'ar') {
            const nameWidth = this.doc.getTextWidth(name);
            this.doc.text(name, this.pageWidth - this.margin - nameWidth, this.y + 6);
        } else {
            this.doc.text(name, this.margin, this.y + 6);
        }
        this.y += 12;

        // Contact info
        const secondaryRgb = hexToRgb(this.config.secondary);
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);

        const contactParts = [
            contact.email,
            contact.phone,
            contact.location,
        ].filter(Boolean);

        const contactLine = contactParts.join('  |  ');
        if (this.locale === 'ar') {
            const lineWidth = this.doc.getTextWidth(contactLine);
            this.doc.text(contactLine, this.pageWidth - this.margin - lineWidth, this.y);
        } else {
            this.doc.text(contactLine, this.margin, this.y);
        }
        this.y += 4;

        // LinkedIn (if provided)
        if (contact.linkedin) {
            const accentRgb = hexToRgb(this.config.accent);
            this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
            this.doc.text(contact.linkedin, this.margin, this.y);
            this.y += 4;
        }

        this.y += 4;
    }

    // Add summary section
    private addSummary(summary: string): void {
        if (!summary) return;

        this.addSectionHeader('summary');
        this.doc.setFontSize(this.config.bodySize);
        this.addWrappedText(summary, 4.5);
    }

    // Add experience section
    private addExperience(experiences: ResumeData['experience']): void {
        if (!experiences || experiences.length === 0) return;

        this.addSectionHeader('experience');

        experiences.forEach((exp, index) => {
            if (index > 0) this.y += 3;
            this.checkPageBreak(25);

            // Position title
            this.doc.setFont('helvetica', 'bold');
            this.doc.setFontSize(11);
            this.doc.text(exp.position || 'Position', this.margin, this.y);

            // Date range (right-aligned)
            this.doc.setFont('helvetica', 'normal');
            this.doc.setFontSize(9);
            const startDate = formatDate(exp.startDate, this.locale);
            const endDate = exp.current
                ? this.locale === 'ar' ? 'حتى الآن' : 'Present'
                : formatDate(exp.endDate, this.locale);
            const dateText = `${startDate} - ${endDate}`;
            const dateWidth = this.doc.getTextWidth(dateText);
            this.doc.text(dateText, this.pageWidth - this.margin - dateWidth, this.y);
            this.y += 4;

            // Company
            this.doc.setFont('helvetica', 'italic');
            this.doc.setFontSize(10);
            let companyLine = exp.company || 'Company';
            if (exp.location) companyLine += `  |  ${exp.location}`;
            this.doc.text(companyLine, this.margin, this.y);
            this.y += 5;

            // Bullets
            this.doc.setFont('helvetica', 'normal');
            this.doc.setFontSize(this.config.bodySize);

            exp.bullets.filter(b => b?.trim()).forEach((bullet) => {
                this.checkPageBreak(8);
                this.doc.text('\u2022', this.margin + 2, this.y);
                const bulletLines = this.doc.splitTextToSize(bullet, this.contentWidth - 8);
                bulletLines.forEach((line: string, i: number) => {
                    this.doc.text(line, this.margin + 6, this.y);
                    this.y += 4;
                });
            });
        });
    }

    // Add education section
    private addEducation(education: ResumeData['education']): void {
        if (!education || education.length === 0) return;

        this.addSectionHeader('education');

        education.forEach((edu, index) => {
            if (index > 0) this.y += 2;
            this.checkPageBreak(15);

            // Degree
            this.doc.setFont('helvetica', 'bold');
            this.doc.setFontSize(11);
            const degreeText = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`;
            this.doc.text(degreeText, this.margin, this.y);

            // Date
            if (edu.graduationDate) {
                this.doc.setFont('helvetica', 'normal');
                this.doc.setFontSize(9);
                const gradDate = formatDate(edu.graduationDate, this.locale);
                const dateWidth = this.doc.getTextWidth(gradDate);
                this.doc.text(gradDate, this.pageWidth - this.margin - dateWidth, this.y);
            }
            this.y += 4;

            // Institution
            this.doc.setFont('helvetica', 'italic');
            this.doc.setFontSize(10);
            let instLine = edu.institution || 'Institution';
            if (edu.gpa) instLine += `  |  GPA: ${edu.gpa}`;
            this.doc.text(instLine, this.margin, this.y);
            this.y += 6;
        });
    }

    // Add skills section
    private addSkills(skills: string[]): void {
        if (!skills || skills.length === 0) return;

        this.addSectionHeader('skills');
        this.doc.setFontSize(this.config.bodySize);

        // Display skills as a wrapped list
        const skillsText = skills.join('  \u2022  ');
        this.addWrappedText(skillsText, 4.5);
    }

    // Add projects section
    private addProjects(projects: ResumeData['projects']): void {
        if (!projects || projects.length === 0) return;

        this.addSectionHeader('projects');

        projects.forEach((project, index) => {
            if (index > 0) this.y += 2;
            this.checkPageBreak(15);

            // Project name
            this.doc.setFont('helvetica', 'bold');
            this.doc.setFontSize(11);
            this.doc.text(project.name || 'Project', this.margin, this.y);
            this.y += 4;

            // Description
            if (project.description) {
                this.doc.setFont('helvetica', 'normal');
                this.doc.setFontSize(this.config.bodySize);
                this.addWrappedText(project.description, 4);
            }

            // Technologies
            if (project.technologies && project.technologies.length > 0) {
                this.doc.setFont('helvetica', 'italic');
                this.doc.setFontSize(9);
                const techText = `Technologies: ${project.technologies.join(', ')}`;
                this.doc.text(techText, this.margin, this.y);
                this.y += 5;
            }
        });
    }

    // Add certifications section
    private addCertifications(certifications: ResumeData['certifications']): void {
        if (!certifications || certifications.length === 0) return;

        this.addSectionHeader('certifications');

        certifications.forEach((cert) => {
            this.checkPageBreak(8);

            // Cert name
            this.doc.setFont('helvetica', 'bold');
            this.doc.setFontSize(10);
            let certLine = cert.name || 'Certification';

            this.doc.setFont('helvetica', 'normal');
            if (cert.issuer) certLine += ` - ${cert.issuer}`;
            this.doc.text(certLine, this.margin, this.y);

            // Date
            if (cert.date) {
                this.doc.setFontSize(9);
                const certDate = formatDate(cert.date, this.locale);
                const dateWidth = this.doc.getTextWidth(certDate);
                this.doc.text(certDate, this.pageWidth - this.margin - dateWidth, this.y);
            }
            this.y += 4;
        });
    }

    // Add languages section
    private addLanguages(languages: ResumeData['languages']): void {
        if (!languages || languages.length === 0) return;

        this.addSectionHeader('languages');
        this.doc.setFontSize(this.config.bodySize);

        const langText = languages.map(l => `${l.name} (${l.proficiency})`).join('  \u2022  ');
        this.doc.text(langText, this.margin, this.y);
        this.y += 5;
    }

    // Generate the PDF
    public generate(resume: ResumeData): jsPDF {
        try {
            // Header
            this.addHeader(resume.contact);

            // Summary
            this.addSummary(resume.summary);

            // Experience
            this.addExperience(resume.experience);

            // Education
            this.addEducation(resume.education);

            // Skills
            this.addSkills(resume.skills);

            // Projects
            this.addProjects(resume.projects);

            // Certifications
            this.addCertifications(resume.certifications);

            // Languages
            this.addLanguages(resume.languages);

            return this.doc;
        } catch (error) {
            logger.error('PDF generation failed', { error: error as Error });
            throw new Error('Failed to generate PDF');
        }
    }

    // Get as blob
    public toBlob(): Blob {
        return this.doc.output('blob');
    }
}

// Main export function
export async function generatePDF(
    resume: ResumeData,
    options: PDFOptions = { template: 'professional' }
): Promise<Blob> {
    const timer = logger.startTimer();

    try {
        const generator = new PDFResumeGenerator(options);
        generator.generate(resume);
        const blob = generator.toBlob();

        const duration = timer();
        logger.info('PDF generated successfully', {
            template: options.template,
            locale: options.locale,
            duration,
            resumeId: resume.id,
        });

        return blob;
    } catch (error) {
        logger.error('PDF generation failed', { error: error as Error });
        throw error;
    }
}

// Download PDF
export async function downloadPDF(resume: ResumeData, options?: PDFOptions): Promise<void> {
    const blob = await generatePDF(resume, options);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title || 'resume'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Generate plain text version (ATS-friendly)
export function generatePlainText(resume: ResumeData, locale: 'ar' | 'en' = 'en'): string {
    const lines: string[] = [];

    // Header
    lines.push(resume.contact.fullName || 'Your Name');
    const contactParts = [
        resume.contact.email,
        resume.contact.phone,
        resume.contact.location,
    ].filter(Boolean);
    lines.push(contactParts.join(' | '));
    if (resume.contact.linkedin) lines.push(resume.contact.linkedin);
    lines.push('');

    // Summary
    if (resume.summary) {
        lines.push(getSectionHeader('summary', locale));
        lines.push('-'.repeat(50));
        lines.push(resume.summary);
        lines.push('');
    }

    // Experience
    if (resume.experience?.length) {
        lines.push(getSectionHeader('experience', locale));
        lines.push('-'.repeat(50));
        resume.experience.forEach((exp) => {
            lines.push(`${exp.position} at ${exp.company}`);
            const dateRange = `${formatDate(exp.startDate, locale)} - ${exp.current ? (locale === 'ar' ? 'حتى الآن' : 'Present') : formatDate(exp.endDate, locale)}`;
            lines.push(dateRange);
            exp.bullets.filter(b => b?.trim()).forEach((bullet) => {
                lines.push(`  * ${bullet}`);
            });
            lines.push('');
        });
    }

    // Education
    if (resume.education?.length) {
        lines.push(getSectionHeader('education', locale));
        lines.push('-'.repeat(50));
        resume.education.forEach((edu) => {
            lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`);
            lines.push(`${edu.institution}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`);
            if (edu.graduationDate) lines.push(formatDate(edu.graduationDate, locale));
            lines.push('');
        });
    }

    // Skills
    if (resume.skills?.length) {
        lines.push(getSectionHeader('skills', locale));
        lines.push('-'.repeat(50));
        lines.push(resume.skills.join(', '));
        lines.push('');
    }

    // Projects
    if (resume.projects?.length) {
        lines.push(getSectionHeader('projects', locale));
        lines.push('-'.repeat(50));
        resume.projects.forEach((project) => {
            lines.push(project.name);
            if (project.description) lines.push(project.description);
            if (project.technologies?.length) {
                lines.push(`Technologies: ${project.technologies.join(', ')}`);
            }
            lines.push('');
        });
    }

    // Certifications
    if (resume.certifications?.length) {
        lines.push(getSectionHeader('certifications', locale));
        lines.push('-'.repeat(50));
        resume.certifications.forEach((cert) => {
            let line = cert.name;
            if (cert.issuer) line += ` - ${cert.issuer}`;
            if (cert.date) line += ` (${formatDate(cert.date, locale)})`;
            lines.push(line);
        });
        lines.push('');
    }

    // Languages
    if (resume.languages?.length) {
        lines.push(getSectionHeader('languages', locale));
        lines.push('-'.repeat(50));
        lines.push(resume.languages.map(l => `${l.name} (${l.proficiency})`).join(', '));
    }

    return lines.join('\n');
}

export default generatePDF;
