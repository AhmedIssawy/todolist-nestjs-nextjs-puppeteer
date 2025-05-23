import React from "react";

function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={classNames("animate-pulse rounded-md bg-slate-200 dark:bg-slate-700", className)}
            {...props}
        />
    );
};

// Header Skeleton
const HeaderSkeleton = () => {
    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center space-x-3 bg-blue-50 px-3 py-2 rounded-lg w-full sm:w-auto">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="flex-1 min-w-0">
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stats Card Skeleton
const StatsCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="ml-3">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-12" />
                </div>
            </div>
        </div>
    );
};

// Stats Grid Skeleton
const StatsGridSkeleton = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {Array(4)
                .fill(null)
                .map((_, index) => (
                    <StatsCardSkeleton key={index} />
                ))}
        </div>
    );
};

// Progress Bar Skeleton
const ProgressBarSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="w-full h-2 sm:h-3 rounded-full" />
        </div>
    );
};

// Filter Section Skeleton
const FilterSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-6 w-40 mb-3" />
                    <div className="flex flex-wrap gap-2">
                        {Array(5)
                            .fill(null)
                            .map((_, index) => (
                                <Skeleton key={index} className="h-8 w-20 rounded-full" />
                            ))}
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    );
};

// Task Card Skeleton
const TaskCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-gray-200 p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="w-5 h-5" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-6 w-24 rounded-md" />
            </div>
        </div>
    );
};

// Task Grid Skeleton
const TaskGridSkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(count)
                .fill(null)
                .map((_, index) => (
                    <TaskCardSkeleton key={index} />
                ))}
        </div>
    );
};

// Complete Dashboard Skeleton
const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <HeaderSkeleton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <StatsGridSkeleton />
                <ProgressBarSkeleton />
                <FilterSkeleton />
                <TaskGridSkeleton />
            </div>
        </div>
    );
};

// Legacy components for backward compatibility
const TaskSkeleton = () => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-[80%]" />
            </div>
            <Skeleton className="h-4 w-[60%]" />
        </div>
    );
};

const TaskListSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
        <div className="space-y-4">
            {Array(count)
                .fill(null)
                .map((_, index) => (
                    <TaskSkeleton key={index} />
                ))}
        </div>
    );
};

export { 
    Skeleton, 
    TaskSkeleton, 
    TaskListSkeleton,
    HeaderSkeleton,
    StatsCardSkeleton,
    StatsGridSkeleton,
    ProgressBarSkeleton,
    FilterSkeleton,
    TaskCardSkeleton,
    TaskGridSkeleton,
    DashboardSkeleton
};