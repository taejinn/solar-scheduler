'use client';

import { useState } from 'react';
import { UserPreferences, AppSettings } from '../types';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onComplete: (preferences: UserPreferences, settings: AppSettings) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [sleepStart, setSleepStart] = useState('01:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'API 키가 유효하지 않습니다.');
      }

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API 키 검증에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    const preferences: UserPreferences = {
      sleepStart,
      sleepEnd,
    };

    const settings: AppSettings = {
      apiKey: apiKey.trim(),
      setupComplete: true,
    };

    onComplete(preferences, settings);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors",
          step >= 1 ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
        )} />
        <div className={cn(
          "w-8 h-0.5 transition-colors",
          step >= 2 ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
        )} />
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors",
          step >= 2 ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
        )} />
      </div>

      {step === 1 && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Solar Scheduler에 오신 것을 환영합니다
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              AI 기반 스마트 일정 관리를 시작하세요
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Upstage Solar API 키
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="up_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                <a
                  href="https://console.upstage.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:underline"
                >
                  Upstage Console
                </a>
                에서 무료로 API 키를 발급받을 수 있습니다.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Guide */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3">
              <h3 className="font-medium text-zinc-900 dark:text-white text-sm">사용 가이드</h3>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">1.</span>
                  <span><strong>자연어로 일정 추가</strong> - &quot;내일 오후 3시 회의&quot; 처럼 입력하면 AI가 자동 분석</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">2.</span>
                  <span><strong>AI 어시스턴트</strong> - 우측 하단 채팅으로 일정 질문 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">3.</span>
                  <span><strong>수면 시간 경고</strong> - 설정한 수면 시간과 겹치면 경고 표시</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleApiKeySubmit}
            disabled={isLoading || !apiKey.trim()}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                검증 중...
              </>
            ) : (
              '다음'
            )}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              수면 시간 설정
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              수면 시간과 겹치는 일정은 경고가 표시됩니다
            </p>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                취침 시간
              </label>
              <input
                type="time"
                value={sleepStart}
                onChange={(e) => setSleepStart(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                기상 시간
              </label>
              <input
                type="time"
                value={sleepEnd}
                onChange={(e) => setSleepEnd(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            나중에 설정에서 변경할 수 있습니다
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              이전
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              시작하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
