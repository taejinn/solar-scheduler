'use client';

import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  work: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  personal: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  study: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  other: { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-700 dark:text-zinc-300' },
};

const categoryLabels: Record<string, string> = {
  work: '업무',
  personal: '개인',
  study: '학습',
  other: '기타',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateOnly = dateStr;
  const todayOnly = today.toISOString().split('T')[0];
  const tomorrowOnly = tomorrow.toISOString().split('T')[0];

  if (dateOnly === todayOnly) return '오늘';
  if (dateOnly === tomorrowOnly) return '내일';

  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function TodoList({ todos, onToggleComplete, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-12 text-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
          할 일이 없습니다
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400">
          위에서 새로운 할 일을 추가해보세요
        </p>
      </div>
    );
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const dateA = new Date(`${a.dueDate}T${a.dueTime}`);
    const dateB = new Date(`${b.dueDate}T${b.dueTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-3">
      {sortedTodos.map((todo) => {
        const colors = categoryColors[todo.category] || categoryColors.other;
        const label = categoryLabels[todo.category] || '기타';

        return (
          <div
            key={todo.id}
            className={`bg-white dark:bg-zinc-900 rounded-xl shadow-md p-4 transition-all ${
              todo.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleComplete(todo.id)}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? 'bg-amber-500 border-amber-500'
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-amber-500'
                }`}
              >
                {todo.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-medium ${
                      todo.completed
                        ? 'text-zinc-400 dark:text-zinc-500 line-through'
                        : 'text-zinc-900 dark:text-white'
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text}`}>
                    {label}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(todo.dueDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {todo.dueTime}
                  </span>
                  {todo.fileName && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <span className="truncate max-w-[100px]">{todo.fileName}</span>
                    </span>
                  )}
                </div>

                {todo.warning && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {todo.warning}
                  </div>
                )}
              </div>

              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
