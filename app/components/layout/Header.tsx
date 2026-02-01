'use client';

import { ChevronLeft, ChevronRight, Calendar, List, Search } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

interface HeaderProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    view: 'month' | 'week' | 'day' | 'list' | 'inbox';
    onViewChange: (view: 'month' | 'week' | 'day' | 'list' | 'inbox') => void;
}

export default function Header({ currentDate, onDateChange, view, onViewChange }: HeaderProps) {
    const handlePrev = () => {
        // Logic depends on view, simplistic for now
        onDateChange(subMonths(currentDate, 1));
    };

    const handleNext = () => {
        onDateChange(addMonths(currentDate, 1));
    };

    return (
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-[#191919]">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onDateChange(new Date())}
                    className="px-3 py-1.5 text-sm font-medium border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    오늘
                </button>
                <div className="flex items-center gap-1">
                    <button onClick={handlePrev} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={handleNext} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {format(currentDate, 'yyyy년 M월')}
                </h2>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button
                        onClick={() => onViewChange('month')}
                        className={cn(
                            "px-3 py-1 text-sm font-medium rounded-md transition-all",
                            view === 'month'
                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        )}
                    >
                        월간
                    </button>
                    <button
                        onClick={() => onViewChange('list')}
                        className={cn(
                            "px-3 py-1 text-sm font-medium rounded-md transition-all",
                            view === 'list' || view === 'inbox'
                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        )}
                    >
                        목록
                    </button>
                </div>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500">
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
