'use client';

import { useState } from 'react';
import { X, Moon, Sun, Save, RefreshCw } from 'lucide-react';
import { UserPreferences } from '@/app/types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    preferences: UserPreferences | null;
    onSave: (preferences: UserPreferences) => void;
}

export default function SettingsModal({ isOpen, onClose, preferences, onSave }: SettingsModalProps) {
    const [sleepStart, setSleepStart] = useState(preferences?.sleepStart || '23:00');
    const [sleepEnd, setSleepEnd] = useState(preferences?.sleepEnd || '07:00');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            sleepStart,
            sleepEnd
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#202020] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">설정</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">수면 시간 설정</h4>
                        <p className="text-xs text-zinc-400">
                            AI가 이 시간에는 일정을 잡지 않도록 최적화합니다.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                    <Moon className="w-3.5 h-3.5" />
                                    취침 시간
                                </label>
                                <input
                                    type="time"
                                    value={sleepStart}
                                    onChange={(e) => setSleepStart(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                    <Sun className="w-3.5 h-3.5" />
                                    기상 시간
                                </label>
                                <input
                                    type="time"
                                    value={sleepEnd}
                                    onChange={(e) => setSleepEnd(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
