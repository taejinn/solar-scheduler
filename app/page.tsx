'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import AppLayout from './components/layout/AppLayout';
import Header from './components/layout/Header';
import CalendarView from './components/calendar/CalendarView';
import ListView from './components/calendar/ListView';
import CreateTodoModal from './components/modals/CreateTodoModal';
import SettingsModal from './components/modals/SettingsModal';
import CommandPalette from './components/modals/CommandPalette';
import ChatBot from './components/ChatBot';
import { UserPreferences, Todo, AppSettings } from './types';
import Onboarding from './components/Onboarding';

type ViewType = 'month' | 'week' | 'day' | 'list' | 'inbox';

export default function Home() {
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isInbox, setIsInbox] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Debounced save function
  const debouncedSaveTodos = useDebouncedCallback(
    async (todosToSave: Todo[]) => {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todos: todosToSave }),
        });
      } catch (error) {
        console.error('Failed to save todos:', error);
      }
    },
    1000
  );

  // Load Data from server
  useEffect(() => {
    const abortController = new AbortController();

    async function loadData() {
      try {
        const response = await fetch('/api/data', {
          signal: abortController.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setTodos(data.todos || []);

          // Check if setup is complete (API key exists)
          if (data.settings?.setupComplete && data.preferences) {
            setUserPreferences(data.preferences);
          } else {
            setShowOnboarding(true);
          }
        } else {
          setShowOnboarding(true);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Failed to load data:', error);
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    }
    loadData();

    return () => abortController.abort();
  }, []);

  // Save todos to server (debounced)
  useEffect(() => {
    if (!isInitialized) return;
    debouncedSaveTodos(todos);
  }, [todos, isInitialized, debouncedSaveTodos]);

  const handleOnboardingComplete = async (preferences: UserPreferences, settings?: AppSettings) => {
    setUserPreferences(preferences);
    setShowOnboarding(false);

    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, settings }),
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleTodoCreated = (todo: Todo) => {
    setTodos((prev) => [todo, ...prev]);
  };

  const handleToggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Keyboard shortcut for CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleViewChange = (v: string) => {
    if (v === 'inbox') {
      setView('list');
      setIsInbox(true);
    } else if (v === 'calendar' || v === 'month') {
      setView('month');
      setIsInbox(false);
    } else if (v === 'settings') {
      setIsSettingsOpen(true);
      setIsInbox(false);
    } else if (['week', 'day', 'list'].includes(v)) {
      setView(v as ViewType);
      setIsInbox(false);
    }
  };

  return (
    <>
      <AppLayout
        onCreateClick={() => setIsCreateModalOpen(true)}
        currentView={view === 'list' && isInbox ? 'inbox' : view}
        onSearchClick={() => setIsCommandPaletteOpen(true)}
        onViewChange={handleViewChange}
      >
        <Header
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          view={view}
          onViewChange={setView}
        />

        <main className="flex-1 relative overflow-hidden flex flex-col">
          {view === 'month' || view === 'week' || view === 'day' ? (
            <CalendarView
              currentDate={currentDate}
              todos={todos}
              onTodoClick={(todo) => {
                handleToggleComplete(todo.id);
              }}
            />
          ) : (
            <ListView
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
            />
          )}
        </main>
      </AppLayout>

      <CreateTodoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userPreferences={userPreferences}
        onTodoCreated={handleTodoCreated}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={userPreferences}
        onSave={handleOnboardingComplete}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        todos={todos}
        onTodoClick={(todo) => handleToggleComplete(todo.id)}
      />

      <ChatBot todos={todos} userPreferences={userPreferences} />

      {showOnboarding && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl max-w-md w-full">
            <Onboarding onComplete={handleOnboardingComplete} />
          </div>
        </div>
      )}
    </>
  );
}
