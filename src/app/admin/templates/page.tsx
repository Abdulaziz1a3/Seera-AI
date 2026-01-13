'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
    Palette,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Copy,
    Star,
    Download,
} from 'lucide-react';

// Mock templates data
const mockTemplates = [
    {
        id: '1',
        name: 'Professional Classic',
        category: 'Corporate',
        premium: false,
        active: true,
        uses: 12453,
        rating: 4.8,
        createdAt: new Date('2023-06-15'),
    },
    {
        id: '2',
        name: 'Modern Minimal',
        category: 'Creative',
        premium: true,
        active: true,
        uses: 8932,
        rating: 4.9,
        createdAt: new Date('2023-08-20'),
    },
    {
        id: '3',
        name: 'Executive Suite',
        category: 'Corporate',
        premium: true,
        active: true,
        uses: 5678,
        rating: 4.7,
        createdAt: new Date('2023-10-05'),
    },
    {
        id: '4',
        name: 'Developer Focus',
        category: 'Technical',
        premium: false,
        active: true,
        uses: 15234,
        rating: 4.6,
        createdAt: new Date('2023-04-12'),
    },
    {
        id: '5',
        name: 'Academic CV',
        category: 'Academic',
        premium: false,
        active: false,
        uses: 3421,
        rating: 4.5,
        createdAt: new Date('2023-11-01'),
    },
];

export default function AdminTemplatesPage() {
    const { locale } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [templates, setTemplates] = useState(mockTemplates);

    const filteredTemplates = templates.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleActive = (id: string) => {
        setTemplates(templates.map((t) =>
            t.id === id ? { ...t, active: !t.active } : t
        ));
    };

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
                        {locale === 'ar' ? 'إدارة القوالب' : 'Template Manager'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {locale === 'ar'
                            ? `${templates.length} قالب متاح`
                            : `${templates.length} templates available`}
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 me-2" />
                    {locale === 'ar' ? 'إضافة قالب' : 'Add Template'}
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative max-w-md">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={locale === 'ar' ? 'بحث في القوالب...' : 'Search templates...'}
                            className="ps-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Templates Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{locale === 'ar' ? 'القالب' : 'Template'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'الفئة' : 'Category'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'النوع' : 'Type'}</TableHead>
                                <TableHead className="text-center">{locale === 'ar' ? 'الاستخدام' : 'Uses'}</TableHead>
                                <TableHead className="text-center">{locale === 'ar' ? 'التقييم' : 'Rating'}</TableHead>
                                <TableHead>{locale === 'ar' ? 'نشط' : 'Active'}</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTemplates.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded border flex items-center justify-center">
                                                <Palette className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{template.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(template.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{template.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {template.premium ? (
                                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                                Premium
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Free</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {template.uses.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                            {template.rating}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={template.active}
                                            onCheckedChange={() => toggleActive(template.id)}
                                        />
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
                                                    <Eye className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'معاينة' : 'Preview'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'تعديل' : 'Edit'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Copy className="h-4 w-4 me-2" />
                                                    {locale === 'ar' ? 'نسخ' : 'Duplicate'}
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
        </div>
    );
}
