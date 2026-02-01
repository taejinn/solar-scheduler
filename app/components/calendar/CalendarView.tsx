'use client';

import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    format,
    parseISO
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Todo } from '@/app/types';

interface CalendarViewProps {
    currentDate: Date;
    todos: Todo[];
    onTodoClick?: (todo: Todo) => void;
}

export default function CalendarView({ currentDate, todos, onTodoClick }: CalendarViewProps) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#191919]">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6"> {/* Fixed rows for consistency, though sometimes 5 is enough */}
                {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const dayString = format(day, 'yyyy-MM-dd');

                    // Filter todos for this day
                    const dayTodos = todos.filter(t => t.dueDate === dayString);

                    return (
                        <div
                            key={day.toISOString()}
                            className={cn(
                                "border-b border-r border-zinc-100 dark:border-zinc-800/50 p-2 min-h-[100px] flex flex-col gap-1 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20",
                                !isCurrentMonth && "bg-zinc-50/30 dark:bg-zinc-900/30 text-zinc-400",
                                isToday(day) && "bg-blue-50/30 dark:bg-blue-900/10"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span
                                    className={cn(
                                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                        isToday(day)
                                            ? "bg-amber-500 text-white"
                                            : "text-zinc-700 dark:text-zinc-300"
                                    )}
                                >
                                    {format(day, 'd')}
                                </span>
                            </div>

                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                                {dayTodos.map(todo => (
                                    <button
                                        key={todo.id}
                                        onClick={() => onTodoClick?.(todo)}
                                        className={cn(
                                            "text-left px-2 py-1 rounded text-xs font-medium truncate w-full shadow-sm border-l-2",
                                            todo.completed ? "opacity-50 line-through bg-zinc-100 border-zinc-300 text-zinc-500" : "bg-white dark:bg-zinc-800 border-amber-400 text-zinc-700 dark:text-zinc-200"
                                        )}
                                    >
                                        {todo.dueTime && <span className="mr-1 opacity-70 font-normal">{todo.dueTime}</span>}
                                        {todo.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
