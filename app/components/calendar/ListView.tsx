'use client';

import { format, isToday, isTomorrow, isSameDay } from 'date-fns';
import { Trash2, AlertCircle, File, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from '@/app/types';

interface ListViewProps {
    todos: Todo[];
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ListView({ todos, onToggleComplete, onDelete }: ListViewProps) {
    if (todos.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 opacity-50" />
                </div>
                <p>No tasks yet.</p>
            </div>
        );
    }

    // Sort todos by date
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const dateA = new Date(`${a.dueDate}T${a.dueTime}`);
        const dateB = new Date(`${b.dueDate}T${b.dueTime}`);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-[#191919]">
            <div className="max-w-3xl mx-auto space-y-1">
                {sortedTodos.map((todo) => {
                    const date = new Date(todo.dueDate);
                    let dateLabel = format(date, 'MMM d');
                    if (isToday(date)) dateLabel = 'Today';
                    if (isTomorrow(date)) dateLabel = 'Tomorrow';

                    return (
                        <div
                            key={todo.id}
                            className={cn(
                                "group flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700",
                                todo.completed && "opacity-50"
                            )}
                        >
                            <button
                                onClick={() => onToggleComplete(todo.id)}
                                className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                    todo.completed
                                        ? "bg-amber-500 border-amber-500 text-white"
                                        : "border-zinc-300 dark:border-zinc-600 hover:border-amber-500"
                                )}
                            >
                                {todo.completed && <Check className="w-3 h-3" />}
                            </button>

                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span className={cn("text-sm font-medium text-zinc-900 dark:text-zinc-100", todo.completed && "line-through")}>
                                        {todo.title}
                                    </span>
                                    {todo.warning && (
                                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
                                            <AlertCircle className="w-3 h-3" />
                                            {todo.warning}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                    <span className={cn("flex items-center gap-1", isToday(date) && "text-amber-600 font-medium")}>
                                        {dateLabel} • {todo.dueTime}
                                    </span>
                                    {todo.fileName && (
                                        <span className="flex items-center gap-1">
                                            <File className="w-3 h-3" />
                                            {todo.fileName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => onDelete(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
