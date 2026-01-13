'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Users,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Mail,
    Shield,
    Ban,
    UserPlus,
    Download,
    Filter,
} from 'lucide-react';

// Mock users data
const mockUsers = [
    {
        id: '1',
        name: 'Ahmed Al-Mansouri',
        email: 'ahmed@example.com',
        plan: 'Pro',
        status: 'active',
        resumes: 5,
        createdAt: new Date('2024-01-05'),
        lastActive: new Date('2024-01-10'),
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        plan: 'Free',
        status: 'active',
        resumes: 1,
        createdAt: new Date('2024-01-08'),
        lastActive: new Date('2024-01-09'),
    },
    {
        id: '3',
        name: 'Mohammed Ali',
        email: 'mohammed@example.com',
        plan: 'Pro',
        status: 'active',
        resumes: 3,
        createdAt: new Date('2023-12-15'),
        lastActive: new Date('2024-01-10'),
    },
    {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        plan: 'Enterprise',
        status: 'active',
        resumes: 12,
        createdAt: new Date('2023-11-20'),
        lastActive: new Date('2024-01-10'),
    },
    {
        id: '5',
        name: 'Khalid Ibrahim',
        email: 'khalid@example.com',
        plan: 'Free',
        status: 'suspended',
        resumes: 0,
        createdAt: new Date('2024-01-02'),
        lastActive: new Date('2024-01-03'),
    },
];

export default function AdminUsersPage() {
    const { locale } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlan = planFilter === 'all' || user.plan.toLowerCase() === planFilter;
        return matchesSearch && matchesPlan;
    });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((u) => u.id));
        }
    };

    const toggleSelectUser = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {locale === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {locale === 'ar'
                            ? `${mockUsers.length} مستخدم مسجل`
                            : `${mockUsers.length} registered users`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 me-2" />
                        {locale === 'ar' ? 'تصدير' : 'Export'}
                    </Button>
                    <Button>
                        <UserPlus className="h-4 w-4 me-2" />
                        {locale === 'ar' ? 'إضافة مستخدم' : 'Add User'}
                    </Button>
                </div>
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
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder={locale === 'ar' ? 'الخطة' : 'Plan'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{locale === 'ar' ? 'جميع الخطط' : 'All Plans'}</SelectItem>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground">
                                {selectedUsers.length} {locale === 'ar' ? 'محدد' : 'selected'}
                            </span>
                            <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 me-1" />
                                {locale === 'ar' ? 'إرسال بريد' : 'Send Email'}
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
                                <Ban className="h-4 w-4 me-1" />
                                {locale === 'ar' ? 'تعليق' : 'Suspend'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>{locale === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الخطة' : 'Plan'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                                <TableHead className="text-center">{locale === 'ar' ? 'السير' : 'Resumes'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'التسجيل' : 'Joined'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'آخر نشاط' : 'Last Active'}</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => toggleSelectUser(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.plan === 'Pro'
                                                    ? 'default'
                                                    : user.plan === 'Enterprise'
                                                        ? 'secondary'
                                                        : 'outline'
                                            }
                                        >
                                            {user.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                user.status === 'active'
                                                    ? 'border-green-500 text-green-600'
                                                    : 'border-red-500 text-red-600'
                                            }
                                        >
                                            {user.status === 'active'
                                                ? locale === 'ar'
                                                    ? 'نشط'
                                                    : 'Active'
                                                : locale === 'ar'
                                                    ? 'معلق'
                                                    : 'Suspended'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{user.resumes}</TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell>{formatDate(user.lastActive)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'تعديل' : 'Edit'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'إرسال بريد' : 'Send Email'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Shield className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'إعادة كلمة المرور' : 'Reset Password'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'حذف' : 'Delete'}
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
