'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    FileText,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    HelpCircle,
    Newspaper,
} from 'lucide-react';

// Mock content data
const mockBlogPosts = [
    { id: '1', title: 'How to Write an ATS-Friendly Resume', status: 'published', views: 1234, date: new Date('2024-01-10') },
    { id: '2', title: 'Top 10 Skills Employers Want', status: 'published', views: 892, date: new Date('2024-01-08') },
    { id: '3', title: 'Interview Preparation Guide', status: 'draft', views: 0, date: new Date('2024-01-15') },
];

const mockFAQs = [
    { id: '1', question: 'How do I create a resume?', category: 'Getting Started', views: 5432 },
    { id: '2', question: 'What is ATS optimization?', category: 'ATS', views: 3210 },
    { id: '3', question: 'How do I export my resume?', category: 'Export', views: 2890 },
];

const mockHelpArticles = [
    { id: '1', title: 'Getting Started with Seera AI', category: 'Basics', views: 8901 },
    { id: '2', title: 'Understanding ATS Scoring', category: 'ATS', views: 4567 },
    { id: '3', title: 'Billing and Subscriptions', category: 'Account', views: 2345 },
];

export default function AdminContentPage() {
    const { locale } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('blog');

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {locale === 'ar' ? 'إدارة المحتوى' : 'Content Management'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {locale === 'ar' ? 'إدارة المدونة ومركز المساعدة' : 'Manage blog and help center content'}
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 me-2" />
                    {locale === 'ar' ? 'إنشاء محتوى' : 'Create Content'}
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="blog" className="gap-2">
                            <Newspaper className="h-4 w-4" />
                            {locale === 'ar' ? 'المدونة' : 'Blog'}
                        </TabsTrigger>
                        <TabsTrigger value="faq" className="gap-2">
                            <HelpCircle className="h-4 w-4" />
                            {locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                        </TabsTrigger>
                        <TabsTrigger value="help" className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            {locale === 'ar' ? 'مركز المساعدة' : 'Help'}
                        </TabsTrigger>
                    </TabsList>

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

                {/* Blog Posts */}
                <TabsContent value="blog">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{locale === 'ar' ? 'العنوان' : 'Title'}</TableHead>
                                        <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                                        <TableHead className="text-center">{locale === 'ar' ? 'المشاهدات' : 'Views'}</TableHead>
                                        <TableHead>{locale === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockBlogPosts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <span className="font-medium">{post.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {post.status === 'published' ? (
                                                    <Badge className="bg-green-500/10 text-green-600">
                                                        {locale === 'ar' ? 'منشور' : 'Published'}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        {locale === 'ar' ? 'مسودة' : 'Draft'}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">{post.views.toLocaleString()}</TableCell>
                                            <TableCell>{formatDate(post.date)}</TableCell>
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
                                                            {locale === 'ar' ? 'معاينة' : 'View'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 me-2" />
                                                            {locale === 'ar' ? 'تعديل' : 'Edit'}
                                                        </DropdownMenuItem>
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
                </TabsContent>

                {/* FAQ */}
                <TabsContent value="faq">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{locale === 'ar' ? 'السؤال' : 'Question'}</TableHead>
                                        <TableHead>{locale === 'ar' ? 'الفئة' : 'Category'}</TableHead>
                                        <TableHead className="text-center">{locale === 'ar' ? 'المشاهدات' : 'Views'}</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockFAQs.map((faq) => (
                                        <TableRow key={faq.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                                                    <span className="font-medium">{faq.question}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{faq.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{faq.views.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Help Articles */}
                <TabsContent value="help">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{locale === 'ar' ? 'المقالة' : 'Article'}</TableHead>
                                        <TableHead>{locale === 'ar' ? 'الفئة' : 'Category'}</TableHead>
                                        <TableHead className="text-center">{locale === 'ar' ? 'المشاهدات' : 'Views'}</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockHelpArticles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                                    <span className="font-medium">{article.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{article.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{article.views.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
