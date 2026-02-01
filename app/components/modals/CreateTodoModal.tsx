'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2, Plus, Sparkles, Bot, Calendar, Clock, Paperclip, AlertCircle } from 'lucide-react';
import { UserPreferences, ParseTodoResponse, Todo } from '@/app/types';
import { cn } from '@/lib/utils';

interface CreateTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userPreferences: UserPreferences | null;
    onTodoCreated: (todo: Todo) => void;
}

export default function CreateTodoModal({ isOpen, onClose, userPreferences, onTodoCreated }: CreateTodoModalProps) {
    const [input, setInput] = useState('');
    const [parsedData, setParsedData] = useState({ title: '', date: '', time: '' });
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            // Reset state on close
            setInput('');
            setParsedData({ title: '', date: '', time: '' });
            setFile(null);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !parsedData.title) return;

        setIsProcessing(true);
        setError(null);

        try {
            // If manual data is provided, use it directly (skip AI)
            if (parsedData.title && parsedData.date) {
                const newTodo: Todo = {
                    id: crypto.randomUUID(),
                    title: parsedData.title,
                    dueDate: parsedData.date,
                    dueTime: parsedData.time || '23:59',
                    category: 'manual',
                    warning: null,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    fileName: file?.name
                };
                onTodoCreated(newTodo);
                onClose();
                return;
            }

            // Otherwise, use AI parsing
            const response = await fetch('/api/parse-todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: input,
                    userPreferences,
                    currentDate: new Date().toISOString().split('T')[0],
                    currentTime: new Date().toTimeString().slice(0, 5),
                }),
            });

            const data: ParseTodoResponse = await response.json();

            if (!data.success || !data.title || !data.dueDate) {
                throw new Error(data.error || '일정을 생성하지 못했습니다.');
            }

            const newTodo: Todo = {
                id: crypto.randomUUID(),
                title: data.title,
                dueDate: data.dueDate,
                dueTime: data.dueTime || '23:59',
                category: data.category || 'other',
                warning: data.warning || null,
                completed: false,
                fileName: file?.name,
                createdAt: new Date().toISOString(),
            };

            onTodoCreated(newTodo);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#202020] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        새 일정 만들기
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* AI Input Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            자연어로 입력하기
                        </label>
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleInputChange}
                                placeholder="예: 내일 오후 2시에 디자인 팀 미팅"
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none min-h-[80px]"
                                disabled={isProcessing}
                            />
                            {isProcessing && (
                                <div className="absolute top-3 right-3">
                                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                            <Bot className="w-3 h-3" />
                            {isProcessing ? 'AI가 내용을 분석하고 있습니다...' : 'AI가 날짜와 시간을 자동으로 인식합니다.'}
                        </p>
                    </div>

                    {/* Manual Overrides (Visual confirmation) */}
                    {(input || parsedData.title) && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">제목</label>
                                <input
                                    type="text"
                                    value={parsedData.title}
                                    onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                                    className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 placeholder-zinc-300 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                                    placeholder="직접 입력하려면 제목을 쓰세요"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> 날짜
                                </label>
                                <input
                                    type="date"
                                    value={parsedData.date}
                                    onChange={(e) => setParsedData({ ...parsedData, date: e.target.value })}
                                    className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-zinc-600 dark:text-zinc-400"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> 시간
                                </label>
                                <input
                                    type="time"
                                    value={parsedData.time}
                                    onChange={(e) => setParsedData({ ...parsedData, time: e.target.value })}
                                    className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-zinc-600 dark:text-zinc-400"
                                />
                            </div>
                        </div>
                    )}

                    {/* File Attachment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Paperclip className="w-4 h-4" />
                            첨부파일
                        </label>
                        <div
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors group"
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {file ? (
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                                    <span className="text-sm underline">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                        <Plus className="w-4 h-4 text-zinc-400" />
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        클릭하여 파일을 업로드하세요
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {error}
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                            disabled={isProcessing}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] px-4 py-2.5 text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-500/20"
                            disabled={isProcessing || (!input.trim() && !parsedData.title)}
                        >
                            {isProcessing ? '생성 중...' : '일정 만들기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
