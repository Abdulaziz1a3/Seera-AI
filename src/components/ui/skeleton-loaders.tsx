'use client';

import { cn } from '@/lib/utils';

// ============================================
// Base Skeleton Component
// ============================================

interface SkeletonProps {
    className?: string;
}

function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted',
                className
            )}
        />
    );
}

// ============================================
// Dashboard Stats Skeleton
// ============================================

export function DashboardStatsSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="relative overflow-hidden rounded-xl border bg-card p-6"
                >
                    <div className="absolute top-0 end-0 h-24 w-24 bg-gradient-to-bl from-muted to-transparent rounded-bl-full" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================
// Resume Card Skeleton
// ============================================

export function ResumeCardSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card">
            <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-4">
                <div className="text-end space-y-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
        </div>
    );
}

// ============================================
// Resume List Skeleton
// ============================================

export function ResumesListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <ResumeCardSkeleton key={i} />
            ))}
        </div>
    );
}

// ============================================
// Quick Actions Skeleton
// ============================================

export function QuickActionsSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================
// Dashboard Page Skeleton (Full)
// ============================================

export function DashboardPageSkeleton() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-11 w-40" />
            </div>

            {/* Stats Grid */}
            <DashboardStatsSkeleton />

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Resumes */}
                <div className="lg:col-span-2 rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-36" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                    </div>
                    <ResumesListSkeleton count={2} />
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="space-y-2 mb-6">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <QuickActionsSkeleton />
                </div>
            </div>

            {/* Pro Tip */}
            <div className="rounded-xl border p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}

// ============================================
// Resume Editor Skeleton
// ============================================

export function ResumeEditorSkeleton() {
    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="space-y-4">
                {/* Section Header */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </div>

                {/* More Sections */}
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Panel */}
            <div className="sticky top-6">
                <div className="rounded-xl border bg-card p-6 aspect-[8.5/11]">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <Skeleton className="h-8 w-48 mx-auto" />
                            <Skeleton className="h-4 w-64 mx-auto" />
                        </div>
                        {/* Content Blocks */}
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                                <Skeleton className="h-3 w-3/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Table Skeleton
// ============================================

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="rounded-xl border overflow-hidden">
            {/* Header */}
            <div className="flex gap-4 p-4 bg-muted/50 border-b">
                {[...Array(cols)].map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 p-4 border-b last:border-0">
                    {[...Array(cols)].map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ============================================
// Card Skeleton (Generic)
// ============================================

export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('rounded-xl border bg-card p-6', className)}>
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

// ============================================
// Profile Skeleton
// ============================================

export function ProfileSkeleton() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    );
}

export { Skeleton };
