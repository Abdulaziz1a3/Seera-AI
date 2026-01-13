'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    MessageSquare,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    MoreVertical,
    Reply,
    Archive,
    TrendingUp,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock support tickets
const mockTickets = [
    {
        id: 'TKT-001',
        user: 'Ahmed Al-Mansouri',
        email: 'ahmed@example.com',
        subject: 'Cannot export resume to PDF',
        status: 'open',
        priority: 'high',
        created: new Date('2024-01-10T10:30:00'),
        lastReply: new Date('2024-01-10T14:20:00'),
    },
    {
        id: 'TKT-002',
        user: 'Sarah Johnson',
        email: 'sarah@example.com',
        subject: 'Billing question about Pro plan',
        status: 'pending',
        priority: 'medium',
        created: new Date('2024-01-09T15:45:00'),
        lastReply: new Date('2024-01-10T09:00:00'),
    },
    {
        id: 'TKT-003',
        user: 'Mohammed Ali',
        email: 'mohammed@example.com',
        subject: 'Feature request: Dark mode',
        status: 'closed',
        priority: 'low',
        created: new Date('2024-01-08T09:15:00'),
        lastReply: new Date('2024-01-08T16:30:00'),
    },
    {
        id: 'TKT-004',
        user: 'Emma Wilson',
        email: 'emma@example.com',
        subject: 'ATS score not updating',
        status: 'open',
        priority: 'high',
        created: new Date('2024-01-10T11:00:00'),
        lastReply: null,
    },
];

export default function AdminSupportPage() {
    const { locale } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');

    const stats = [
        { label: locale === 'ar' ? 'مفتوحة' : 'Open', value: 12, color: 'text-blue-500' },
        { label: locale === 'ar' ? 'معلقة' : 'Pending', value: 8, color: 'text-amber-500' },
        { label: locale === 'ar' ? 'مغلقة اليوم' : 'Closed Today', value: 15, color: 'text-green-500' },
        { label: locale === 'ar' ? 'متوسط الرد' : 'Avg. Response', value: '2.5h', color: 'text-primary' },
    ];

    const filteredTickets = mockTickets.filter((ticket) => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.user.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesTab = activeTab === 'all' || ticket.status === activeTab;
        return matchesSearch && matchesStatus && matchesTab;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-blue-500/10 text-blue-600">{locale === 'ar' ? 'مفتوح' : 'Open'}</Badge>;
            case 'pending':
                return <Badge className="bg-amber-500/10 text-amber-600">{locale === 'ar' ? 'معلق' : 'Pending'}</Badge>;
            case 'closed':
                return <Badge variant="secondary">{locale === 'ar' ? 'مغلق' : 'Closed'}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge variant="destructive">{locale === 'ar' ? 'عالي' : 'High'}</Badge>;
            case 'medium':
                return <Badge className="bg-amber-500/10 text-amber-600">{locale === 'ar' ? 'متوسط' : 'Medium'}</Badge>;
            case 'low':
                return <Badge variant="outline">{locale === 'ar' ? 'منخفض' : 'Low'}</Badge>;
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    const formatTime = (date: Date | null) => {
        if (!date) return '-';
        return date.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    {locale === 'ar' ? 'تذاكر الدعم' : 'Support Tickets'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {locale === 'ar' ? 'إدارة طلبات الدعم من المستخدمين' : 'Manage user support requests'}
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <TabsList>
                        <TabsTrigger value="all">
                            {locale === 'ar' ? 'الكل' : 'All'}
                        </TabsTrigger>
                        <TabsTrigger value="open" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {locale === 'ar' ? 'مفتوح' : 'Open'}
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {locale === 'ar' ? 'معلق' : 'Pending'}
                        </TabsTrigger>
                        <TabsTrigger value="closed" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {locale === 'ar' ? 'مغلق' : 'Closed'}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={locale === 'ar' ? 'بحث...' : 'Search...'}
                        className="ps-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Tickets Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{locale === 'ar' ? 'التذكرة' : 'Ticket'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الأولوية' : 'Priority'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'آخر رد' : 'Last Reply'}</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{ticket.id}</code>
                                            </div>
                                            <p className="font-medium mt-1">{ticket.subject}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                                {ticket.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{ticket.user}</p>
                                                <p className="text-xs text-muted-foreground">{ticket.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatTime(ticket.lastReply)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Reply className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'رد' : 'Reply'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <CheckCircle2 className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'إغلاق' : 'Close'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Archive className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'أرشفة' : 'Archive'}
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
