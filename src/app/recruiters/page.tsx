'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Search,
    Users,
    Filter,
    Unlock,
    Lock,
    Download,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Clock,
    Star,
    Sparkles,
    CreditCard,
    Building2,
    CheckCircle2,
    ChevronDown,
    Eye,
    MessageSquare,
    Folder,
    Settings,
    TrendingUp,
    DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    CREDIT_PACKAGES,
    SUBSCRIPTION_PLANS,
    GCC_LOCATIONS,
    INDUSTRIES,
} from '@/lib/talent-marketplace';

// Mock candidates data
const MOCK_CANDIDATES = [
    {
        id: '1',
        displayName: 'A████ M█████',
        fullName: 'Ahmed Mohammed',
        currentTitle: 'Civil Engineer',
        currentCompany: 'Hidden',
        location: 'Riyadh',
        yearsExperience: 3,
        skills: ['AutoCAD', 'Revit', 'Structural Analysis', 'Project Management'],
        education: 'BS Civil Engineering',
        summary: 'Experienced civil engineer with expertise in structural design and project management...',
        matchScore: 92,
        availabilityStatus: 'actively_looking',
        desiredSalary: { min: 18000, max: 25000 },
        isUnlocked: false,
        email: 'ahmed.m@email.com',
        phone: '+966 5XX XXX XXX',
    },
    {
        id: '2',
        displayName: 'S███ A██████',
        fullName: 'Sara Abdullah',
        currentTitle: 'Senior Software Engineer',
        currentCompany: 'Hidden',
        location: 'Dubai',
        yearsExperience: 6,
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Python'],
        education: 'MS Computer Science',
        summary: 'Full-stack developer with strong experience in building scalable web applications...',
        matchScore: 88,
        availabilityStatus: 'open_to_offers',
        desiredSalary: { min: 28000, max: 40000 },
        isUnlocked: false,
        email: 'sara.a@email.com',
        phone: '+971 5XX XXX XXX',
    },
    {
        id: '3',
        displayName: 'K████ A███',
        fullName: 'Khalid Ali',
        currentTitle: 'Financial Analyst',
        currentCompany: 'Hidden',
        location: 'Jeddah',
        yearsExperience: 4,
        skills: ['Financial Modeling', 'Excel', 'SAP', 'Bloomberg', 'Python'],
        education: 'MBA Finance',
        summary: 'Detail-oriented financial analyst with experience in investment analysis and reporting...',
        matchScore: 85,
        availabilityStatus: 'actively_looking',
        desiredSalary: { min: 20000, max: 30000 },
        isUnlocked: true,
        email: 'khalid.a@email.com',
        phone: '+966 5XX XXX XXX',
    },
    {
        id: '4',
        displayName: 'N██ H█████',
        fullName: 'Noura Hassan',
        currentTitle: 'Marketing Manager',
        currentCompany: 'Hidden',
        location: 'Riyadh',
        yearsExperience: 5,
        skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Google Analytics', 'Social Media'],
        education: 'BA Marketing',
        summary: 'Creative marketing professional with a track record of driving brand growth...',
        matchScore: 78,
        availabilityStatus: 'open_to_offers',
        desiredSalary: { min: 22000, max: 32000 },
        isUnlocked: false,
        email: 'noura.h@email.com',
        phone: '+966 5XX XXX XXX',
    },
];

export default function RecruiterPortalPage() {
    // Company state (mock)
    const [credits, setCredits] = useState(45);
    const [plan] = useState('professional');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedIndustry, setSelectedIndustry] = useState<string>('');
    const [minExperience, setMinExperience] = useState<string>('');
    const [maxExperience, setMaxExperience] = useState<string>('');
    const [candidates, setCandidates] = useState(MOCK_CANDIDATES);

    // UI state
    const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string>('pack-25');

    // Statistics
    const stats = {
        totalSearches: 234,
        totalUnlocks: 67,
        responseRate: 73,
        hires: 4,
    };

    // Handle unlock
    const handleUnlock = (candidateId: string) => {
        if (credits < 1) {
            toast.error('Not enough credits. Please purchase more.');
            setBuyCreditsOpen(true);
            return;
        }

        setCandidates(prev =>
            prev.map(c =>
                c.id === candidateId ? { ...c, isUnlocked: true } : c
            )
        );
        setCredits(prev => prev - 1);
        toast.success('CV unlocked! Contact information is now visible.');
    };

    // Handle search
    const handleSearch = () => {
        // In real implementation, this would call the API
        toast.success(`Found ${candidates.length} matching candidates`);
    };

    // Get availability color
    const getAvailabilityColor = (status: string) => {
        switch (status) {
            case 'actively_looking': return 'bg-green-500';
            case 'open_to_offers': return 'bg-amber-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Nav */}
            <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Seera AI for Recruiters</h1>
                            <p className="text-xs text-muted-foreground">Find top GCC talent</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Dialog open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="font-bold">{credits}</span> Credits
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Buy Credits</DialogTitle>
                                    <DialogDescription>
                                        Each credit unlocks one candidate's full profile
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                    {CREDIT_PACKAGES.map((pkg) => (
                                        <Card
                                            key={pkg.id}
                                            className={`cursor-pointer transition-all ${selectedPackage === pkg.id
                                                ? 'border-primary ring-2 ring-primary'
                                                : 'hover:border-primary/50'
                                                }`}
                                            onClick={() => setSelectedPackage(pkg.id)}
                                        >
                                            <CardContent className="pt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold">{pkg.name}</h3>
                                                    {pkg.popular && (
                                                        <Badge className="bg-primary">Popular</Badge>
                                                    )}
                                                </div>
                                                <div className="text-3xl font-bold">
                                                    {pkg.credits} <span className="text-sm font-normal">CVs</span>
                                                </div>
                                                <div className="text-lg text-primary font-semibold mt-1">
                                                    {pkg.price} SAR
                                                </div>
                                                {pkg.savings && (
                                                    <Badge variant="secondary" className="mt-2">
                                                        Save {pkg.savings}%
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <Button className="w-full mt-4">
                                    <CreditCard className="h-4 w-4 me-2" />
                                    Purchase Credits
                                </Button>
                            </DialogContent>
                        </Dialog>

                        <Badge variant="outline" className="px-3 py-1.5">
                            <CheckCircle2 className="h-4 w-4 me-1 text-green-500" />
                            Verified Company
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { icon: Search, label: 'Searches', value: stats.totalSearches, color: 'text-blue-500' },
                        { icon: Unlock, label: 'Unlocked', value: stats.totalUnlocks, color: 'text-green-500' },
                        { icon: MessageSquare, label: 'Response Rate', value: `${stats.responseRate}%`, color: 'text-purple-500' },
                        { icon: CheckCircle2, label: 'Hires', value: stats.hires, color: 'text-amber-500' },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="pt-4 flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search Talent
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Job title, skills, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-12"
                                />
                            </div>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GCC_LOCATIONS.map((loc) => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INDUSTRIES.map((ind) => (
                                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="number"
                                placeholder="Min experience (years)"
                                value={minExperience}
                                onChange={(e) => setMinExperience(e.target.value)}
                            />

                            <Input
                                type="number"
                                placeholder="Max experience (years)"
                                value={maxExperience}
                                onChange={(e) => setMaxExperience(e.target.value)}
                            />

                            <Button className="h-10" onClick={handleSearch}>
                                <Search className="h-4 w-4 me-2" />
                                Search
                            </Button>
                        </div>

                        <Button variant="outline" size="sm" className="gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Match - Find Best 10
                            <Badge variant="secondary" className="text-xs">Pro</Badge>
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Found {candidates.length} matching candidates
                        </h2>
                        <Select defaultValue="match">
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="match">Best Match</SelectItem>
                                <SelectItem value="experience">Experience</SelectItem>
                                <SelectItem value="recent">Recently Active</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {candidates.map((candidate) => (
                        <Card key={candidate.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    {/* Avatar & Basic Info */}
                                    <div className="flex-shrink-0">
                                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>

                                    {/* Main Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                                    {candidate.isUnlocked ? candidate.fullName : candidate.displayName}
                                                    {candidate.isUnlocked && (
                                                        <Badge className="bg-green-500">Unlocked</Badge>
                                                    )}
                                                </h3>
                                                <p className="text-muted-foreground">{candidate.currentTitle}</p>
                                            </div>

                                            <div className="text-end">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                    <span className="font-bold text-lg">{candidate.matchScore}%</span>
                                                    <span className="text-sm text-muted-foreground">match</span>
                                                </div>
                                                <Badge className={`${getAvailabilityColor(candidate.availabilityStatus)} text-white text-xs`}>
                                                    {candidate.availabilityStatus.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {candidate.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" />
                                                {candidate.yearsExperience} years
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GraduationCap className="h-4 w-4" />
                                                {candidate.education}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" />
                                                {candidate.desiredSalary.min.toLocaleString()} - {candidate.desiredSalary.max.toLocaleString()} SAR
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {candidate.skills.map((skill) => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>

                                        {/* Summary */}
                                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                            {candidate.summary}
                                        </p>

                                        {/* Contact Info (only if unlocked) */}
                                        {candidate.isUnlocked && (
                                            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                                                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Contact Information
                                                </h4>
                                                <div className="flex flex-wrap gap-6 text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        {candidate.email}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        {candidate.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col gap-2 flex-shrink-0">
                                        {candidate.isUnlocked ? (
                                            <>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Download className="h-4 w-4" />
                                                    Download CV
                                                </Button>
                                                <Button size="sm" className="gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    Send Message
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                                                    onClick={() => handleUnlock(candidate.id)}
                                                >
                                                    <Unlock className="h-4 w-4" />
                                                    Unlock - 1 Credit
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Folder className="h-4 w-4" />
                                                    Save
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
