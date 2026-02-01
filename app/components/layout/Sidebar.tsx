'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CheckSquare,
    Settings,
    Plus,
    Search,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    startOfWeek,
    endOfWeek
} from 'date-fns';

interface SidebarProps {
    onCreateClick?: () => void;
    onSearchClick?: () => void;
    currentView?: string;
    onViewChange?: (view: string) => void;
}

export default function Sidebar({ onCreateClick, onSearchClick, currentView, onViewChange }: SidebarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Calendar Grid Generation
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <aside className="w-[240px] h-full flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#202020]">
            {/* Header / User Switcher */}
            <div className="h-12 flex items-center px-4 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer mb-2">
                <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-xs text-white font-bold">
                    S
                </div>
                <span className="text-sm font-medium truncate flex-1">Solar Scheduler</span>
                <div className="text-xs text-zinc-400">v0.2</div>
            </div>

            {/* Primary Actions */}
            <div className="px-3 mb-2 space-y-2">
                <button
                    onClick={onCreateClick}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>일정 만들기</span>
                </button>

                <button
                    onClick={onSearchClick}
                    className="w-full flex items-center justify-start gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 rounded-md transition-colors border border-transparent shadow-sm bg-white dark:bg-zinc-800 dark:border-zinc-700"
                >
                    <Search className="w-4 h-4 text-zinc-400" />
                    <span className="opacity-60">빠른 검색...</span>
                    <span className="ml-auto text-xs opacity-40">⌘K</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="px-2 space-y-0.5 mb-6">
                <NavItem
                    icon={<CheckSquare className="w-4 h-4" />}
                    label="수신함"
                    active={currentView === 'inbox'}
                    onClick={() => onViewChange?.('inbox')}
                />
                <NavItem
                    icon={<CalendarIcon className="w-4 h-4" />}
                    label="캘린더"
                    active={currentView === 'calendar' || currentView === 'month'}
                    onClick={() => onViewChange?.('month')}
                />
                <NavItem
                    icon={<Settings className="w-4 h-4" />}
                    label="설정"
                    active={currentView === 'settings'}
                    onClick={() => onViewChange?.('settings')}
                />
            </nav>

            <div className="border-t border-zinc-200 dark:border-zinc-800 my-2 mx-4" />

            {/* Mini Calendar (Simplified) */}
            <div className="px-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{format(currentDate, 'yyyy년 M월')}</span>
                    <div className="flex gap-1">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                            <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-2 text-center text-xs mb-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                        <div key={i} className="text-zinc-400 font-medium">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                    {calendarDays.map((date, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-6 h-6 flex items-center justify-center rounded-full mx-auto",
                                !isSameMonth(date, currentDate) && "text-zinc-300 dark:text-zinc-700",
                                isSameDay(date, new Date()) && "bg-amber-500 text-white font-bold"
                            )}
                        >
                            {format(date, 'd')}
                        </div>
                    ))}
                </div>
            </div>

        </aside>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                active
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
        >
            {icon}
            <span>{label}</span>
            {/* {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />} */}
        </button>
    )
}
