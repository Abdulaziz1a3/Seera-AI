// Talent Pool & Recruiter Marketplace Types and Services

export interface TalentProfile {
    id: string;
    userId: string;
    resumeId: string;

    // Visibility settings
    isActive: boolean;
    visibleToRecruiters: boolean;
    availabilityStatus: 'actively_looking' | 'open_to_offers' | 'not_looking';

    // Privacy options
    hideCurrentEmployer: boolean;
    hideSalaryHistory: boolean;
    blockedCompanies: string[];
    verifiedCompaniesOnly: boolean;

    // Profile data (from resume)
    displayName: string; // Can be anonymized
    currentTitle: string;
    currentCompany: string; // May be hidden
    location: string;
    yearsExperience: number;
    skills: string[];
    industries: string[];
    education: {
        degree: string;
        field: string;
        institution: string;
    }[];

    // Preferences
    desiredRoles: string[];
    desiredSalary: {
        min: number;
        max: number;
        currency: string;
    };
    willingToRelocate: boolean;
    preferredLocations: string[];
    noticePeriod: string;

    // Metadata
    lastUpdated: Date;
    createdAt: Date;
    viewCount: number;
    unlockCount: number;
}

export interface RecruiterCompany {
    id: string;
    name: string;
    nameAr?: string;
    logo?: string;
    website?: string;
    industry: string;
    size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    location: string;
    isVerified: boolean;
    verifiedAt?: Date;

    // Contact
    contactName: string;
    contactEmail: string;
    contactPhone?: string;

    // Subscription
    plan: 'free_trial' | 'starter' | 'professional' | 'enterprise';
    credits: number;
    subscriptionExpiry?: Date;

    // Activity
    totalUnlocks: number;
    totalSearches: number;
    createdAt: Date;
}

export interface RecruiterUser {
    id: string;
    companyId: string;
    email: string;
    name: string;
    role: 'admin' | 'recruiter' | 'viewer';
    isActive: boolean;
    createdAt: Date;
}

export interface CandidateUnlock {
    id: string;
    recruiterId: string;
    companyId: string;
    talentProfileId: string;
    unlockedAt: Date;
    creditsUsed: number;
    notes?: string;
    status: 'unlocked' | 'contacted' | 'interviewing' | 'hired' | 'rejected';
}

export interface RecruiterSearch {
    id: string;
    recruiterId: string;
    companyId: string;

    // Search criteria
    jobTitle?: string;
    keywords?: string[];
    skills?: string[];
    minExperience?: number;
    maxExperience?: number;
    locations?: string[];
    industries?: string[];
    salaryMin?: number;
    salaryMax?: number;
    availability?: string[];
    education?: string[];

    // Results
    resultsCount: number;
    savedAt: Date;
    name?: string; // Saved search name
}

export interface CreditPackage {
    id: string;
    name: string;
    nameAr: string;
    credits: number;
    price: number; // SAR
    priceUsd: number;
    popular?: boolean;
    savings?: number; // Percentage
}

export interface Message {
    id: string;
    fromType: 'recruiter' | 'candidate';
    fromId: string;
    toId: string;
    subject: string;
    body: string;
    isRead: boolean;
    createdAt: Date;
    replyToId?: string;
}

// Credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
    {
        id: 'single',
        name: 'Single CV',
        nameAr: 'سيرة ذاتية واحدة',
        credits: 1,
        price: 50,
        priceUsd: 13,
    },
    {
        id: 'pack-10',
        name: '10 CVs Pack',
        nameAr: 'حزمة 10 سير ذاتية',
        credits: 10,
        price: 400,
        priceUsd: 107,
        savings: 20,
    },
    {
        id: 'pack-25',
        name: '25 CVs Pack',
        nameAr: 'حزمة 25 سيرة ذاتية',
        credits: 25,
        price: 875,
        priceUsd: 233,
        savings: 30,
        popular: true,
    },
    {
        id: 'pack-50',
        name: '50 CVs Pack',
        nameAr: 'حزمة 50 سيرة ذاتية',
        credits: 50,
        price: 1500,
        priceUsd: 400,
        savings: 40,
    },
];

// Subscription plans
export const SUBSCRIPTION_PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        nameAr: 'المبتدئ',
        monthlyPrice: 499,
        monthlyPriceUsd: 133,
        monthlyCredits: 20,
        features: [
            '20 CV unlocks/month',
            'Basic search filters',
            'Email support',
        ],
        featuresAr: [
            '20 فتح سيرة ذاتية/شهر',
            'فلاتر بحث أساسية',
            'دعم بالبريد الإلكتروني',
        ],
    },
    {
        id: 'professional',
        name: 'Professional',
        nameAr: 'المحترف',
        monthlyPrice: 1499,
        monthlyPriceUsd: 400,
        monthlyCredits: 75,
        popular: true,
        features: [
            '75 CV unlocks/month',
            'Advanced AI matching',
            'Bulk messaging',
            'Priority support',
            'Saved searches',
        ],
        featuresAr: [
            '75 فتح سيرة ذاتية/شهر',
            'مطابقة ذكية بالذكاء الاصطناعي',
            'رسائل جماعية',
            'دعم أولوية',
            'حفظ البحث',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        nameAr: 'المؤسسات',
        monthlyPrice: 3999,
        monthlyPriceUsd: 1066,
        monthlyCredits: -1, // Unlimited
        features: [
            'Unlimited CV unlocks',
            'API access',
            'ATS integration',
            'Dedicated account manager',
            'Custom reports',
            'Team management',
        ],
        featuresAr: [
            'فتح سير ذاتية غير محدود',
            'وصول API',
            'تكامل ATS',
            'مدير حساب مخصص',
            'تقارير مخصصة',
            'إدارة الفريق',
        ],
    },
];

// Industry options
export const INDUSTRIES = [
    'Technology',
    'Finance & Banking',
    'Oil & Gas',
    'Construction',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Government',
    'Telecommunications',
    'Real Estate',
    'Hospitality',
    'Transportation',
    'Legal',
    'Marketing & Advertising',
];

export const INDUSTRIES_AR: Record<string, string> = {
    'Technology': 'التكنولوجيا',
    'Finance & Banking': 'المالية والبنوك',
    'Oil & Gas': 'النفط والغاز',
    'Construction': 'البناء والمقاولات',
    'Healthcare': 'الرعاية الصحية',
    'Education': 'التعليم',
    'Retail': 'التجزئة',
    'Manufacturing': 'التصنيع',
    'Government': 'الحكومة',
    'Telecommunications': 'الاتصالات',
    'Real Estate': 'العقارات',
    'Hospitality': 'الضيافة',
    'Transportation': 'النقل',
    'Legal': 'القانون',
    'Marketing & Advertising': 'التسويق والإعلان',
};

// Locations
export const GCC_LOCATIONS = [
    'Riyadh',
    'Jeddah',
    'Dammam',
    'Mecca',
    'Medina',
    'Khobar',
    'Dubai',
    'Abu Dhabi',
    'Doha',
    'Kuwait City',
    'Manama',
    'Muscat',
];
