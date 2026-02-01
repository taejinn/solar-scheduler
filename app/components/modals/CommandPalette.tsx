'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, CheckCircle, Circle, X } from 'lucide-react';
import { Todo } from '../../types';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  onTodoClick?: (todo: Todo) => void;
}

export default function CommandPalette({ isOpen, onClose, todos, onTodoClick }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Reset query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Filter todos based on query
  const filteredTodos = useMemo(() => {
    if (!query.trim()) return todos.slice(0, 10);

    const lowerQuery = query.toLowerCase();
    return todos.filter(todo =>
      todo.title.toLowerCase().includes(lowerQuery) ||
      todo.category.toLowerCase().includes(lowerQuery) ||
      todo.dueDate.includes(query)
    ).slice(0, 10);
  }, [query, todos]);

  const handleTodoSelect = (todo: Todo) => {
    onTodoClick?.(todo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white dark:bg-[#202020] w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="일정 검색... (제목, 카테고리, 날짜)"
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          )}
          <span className="ml-2 text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-400">ESC</span>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredTodos.length > 0 ? (
            <div className="py-2">
              <div className="px-4 pb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {query ? `검색 결과 (${filteredTodos.length})` : '최근 일정'}
              </div>
              <div className="space-y-0.5 px-2">
                {filteredTodos.map((todo) => (
                  <button
                    key={todo.id}
                    onClick={() => handleTodoSelect(todo)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group text-left"
                  >
                    {todo.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "truncate",
                        todo.completed
                          ? "text-zinc-400 line-through"
                          : "text-zinc-900 dark:text-zinc-100"
                      )}>
                        {todo.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span>{todo.dueDate}</span>
                        <span>{todo.dueTime}</span>
                        <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
                          {todo.category}
                        </span>
                      </div>
                    </div>
                    <Calendar className="w-4 h-4 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>검색 결과가 없습니다</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
          <span>팁: 날짜(2026-02-01)나 카테고리(work, personal)로 검색해보세요</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-[10px]">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-[10px]">K</kbd>
          </span>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
