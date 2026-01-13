'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    CreditCard,
    Search,
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Calendar,
    MoreVertical,
    Eye,
    Mail,
    Ban,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock subscriptions data
const mockSubscriptions = [
    {
        id: '1',
        user: 'Ahmed Al-Mansouri',
        email: 'ahmed@example.com',
        plan: 'Pro',
        status: 'active',
        amount: 29.99,
        startDate: new Date('2024-01-01'),
        nextBilling: new Date('2024-02-01'),
    },
    {
        id: '2',
        user: 'Emma Wilson',
        email: 'emma@example.com',
        plan: 'Enterprise',
        status: 'active',
        amount: 99.99,
        startDate: new Date('2023-11-15'),
        nextBilling: new Date('2024-02-15'),
    },
    {
        id: '3',
        user: 'Mohammed Ali',
        email: 'mohammed@example.com',
        plan: 'Pro',
        status: 'canceled',
        amount: 29.99,
        startDate: new Date('2023-08-20'),
        nextBilling: null,
    },
    {
        id: '4',
        user: 'Sarah Johnson',
        email: 'sarah@example.com',
        plan: 'Pro',
        status: 'past_due',
        amount: 29.99,
        startDate: new Date('2023-12-05'),
        nextBilling: new Date('2024-01-05'),
    },
];

export default function AdminSubscriptionsPage() {
    const { locale } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const stats = [
        {
            label: locale === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue',
            value: '$12,847',
            change: '+15.2%',
            trend: 'up',
            icon: DollarSign,
        },
        {
            label: locale === 'ar' ? 'المشتركين النشطين' : 'Active Subscribers',
            value: '2,847',
            change: '+8.1%',
            trend: 'up',
            icon: Users,
        },
        {
            label: locale === 'ar' ? 'معدل الإلغاء' : 'Churn Rate',
            value: '2.3%',
            change: '-0.5%',
            trend: 'down',
            icon: TrendingDown,
        },
        {
            label: locale === 'ar' ? 'متوسط العائد' : 'ARPU',
            value: '$34.50',
            change: '+3.2%',
            trend: 'up',
            icon: TrendingUp,
        },
    ];

    const filteredSubscriptions = mockSubscriptions.filter((sub) => {
        const matchesSearch =
            sub.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-600">{locale === 'ar' ? 'نشط' : 'Active'}</Badge>;
            case 'canceled':
                return <Badge variant="secondary">{locale === 'ar' ? 'ملغي' : 'Canceled'}</Badge>;
            case 'past_due':
                return <Badge className="bg-red-500/10 text-red-600">{locale === 'ar' ? 'متأخر' : 'Past Due'}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    {locale === 'ar' ? 'إدارة الاشتراكات' : 'Subscription Management'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {locale === 'ar' ? 'إدارة وتتبع اشتراكات المستخدمين' : 'Manage and track user subscriptions'}
                </p>
            </div>

            {/* Stats */}
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
                                            <TrendingDown className="h-4 w-4 text-green-500" />
                                        )}
                                        <span className="text-sm text-green-500">{stat.change}</span>
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

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={locale === 'ar' ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
                                className="ps-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder={locale === 'ar' ? 'الحالة' : 'Status'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                                <SelectItem value="active">{locale === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                                <SelectItem value="canceled">{locale === 'ar' ? 'ملغي' : 'Canceled'}</SelectItem>
                                <SelectItem value="past_due">{locale === 'ar' ? 'متأخر' : 'Past Due'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Subscriptions Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{locale === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الخطة' : 'Plan'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'بداية الاشتراك' : 'Start Date'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الفاتورة القادمة' : 'Next Billing'}</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubscriptions.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                                {sub.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{sub.user}</p>
                                                <p className="text-sm text-muted-foreground">{sub.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={sub.plan === 'Enterprise' ? 'secondary' : 'default'}>
                                            {sub.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                    <TableCell>${sub.amount}/mo</TableCell>
                                    <TableCell>{formatDate(sub.startDate)}</TableCell>
                                    <TableCell>{formatDate(sub.nextBilling)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'إرسال فاتورة' : 'Send Invoice'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    <Ban className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'إلغاء الاشتراك' : 'Cancel Subscription'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
