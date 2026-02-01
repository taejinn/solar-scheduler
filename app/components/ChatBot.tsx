'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send } from 'lucide-react';
import { ChatMessage, ChatRequest, ChatResponse, Todo, UserPreferences } from '../types';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  todos: Todo[];
  userPreferences: UserPreferences | null;
}

export default function ChatBot({ todos, userPreferences }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '안녕하세요! 일정에 대해 물어보세요.\n\n예시:\n• "오늘 며칠이지?"\n• "내일 일정 뭐있어?"\n• "이번주 할 일 알려줘"',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);

      const requestBody: ChatRequest = {
        message: userMessage.content,
        todos,
        userPreferences,
        currentDate,
        currentTime,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data: ChatResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.success
          ? data.message || '응답을 받지 못했습니다.'
          : data.error || '오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-300 ease-out border",
          isOpen
            ? "bg-zinc-800 dark:bg-zinc-700 text-white border-zinc-800 dark:border-zinc-600 rotate-90"
            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:scale-105"
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-[360px] sm:w-[400px] bg-white dark:bg-[#202020] rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col z-40 overflow-hidden transition-all duration-300 ease-out origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
        style={{ maxHeight: 'min(600px, 75vh)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#202020] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold text-sm">
              AI
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Solar Assistant</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-[#1a1a1a]">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm mr-2 mt-1 shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={cn(
                  "p-3 rounded-2xl max-w-[85%] text-sm shadow-sm",
                  msg.role === 'user'
                    ? "bg-zinc-900 text-white rounded-br-none dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-white text-zinc-900 border border-zinc-200 rounded-bl-none dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                )}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                  {/* 
                      Using ReactMarkdown directly. 
                      Note: You might need to style specific elements if 'prose' tailwind plugin is not installed.
                      Since we didn't check for @tailwindcss/typography, I'll add some manual simplistic styling 
                      helpers or assume standard markdown rendering.
                   */}
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }: any) => <ul className="list-disc pl-4 my-1" {...props} />,
                      ol: ({ node, ...props }: any) => <ol className="list-decimal pl-4 my-1" {...props} />,
                      li: ({ node, ...props }: any) => <li className="my-0.5" {...props} />,
                      p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0" {...props} />,
                      a: ({ node, ...props }: any) => <a className="text-amber-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      code: ({ node, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return (
                          <code className={cn("bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 font-mono text-xs", className)} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <span className="text-[10px] text-zinc-400 px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm mr-2 mt-1 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#202020]">
          <form
            onSubmit={handleSubmit} // Changed to handleSubmit
            className="relative flex items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Solar AI에게 무엇이든 물어보세요..."
              className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-zinc-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
