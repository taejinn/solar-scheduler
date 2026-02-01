import { NextRequest, NextResponse } from 'next/server';
import { ParseTodoRequest, ParseTodoResponse, UserPreferences } from '../../types';
import { getApiKey } from '../../lib/db';

const SOLAR_API_URL = 'https://api.upstage.ai/v1/chat/completions';

function isTimeInSleepRange(
  time: string,
  sleepStart: string,
  sleepEnd: string
): boolean {
  const [h, m] = time.split(':').map(Number);
  const [startH, startM] = sleepStart.split(':').map(Number);
  const [endH, endM] = sleepEnd.split(':').map(Number);

  const timeMinutes = h * 60 + m;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  } else {
    return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ParseTodoRequest = await request.json();
    const { text, userPreferences, currentDate, currentTime } = body;

    if (!text) {
      return NextResponse.json<ParseTodoResponse>(
        { success: false, error: '텍스트를 입력해주세요.' },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json<ParseTodoResponse>(
        { success: false, error: 'API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a todo parser assistant. Extract todo information from the user's natural language input.

Current date: ${currentDate}
Current time: ${currentTime}

Rules:
- Parse Korean time/date expressions
- "내일" = tomorrow, "모레" = day after tomorrow
- "아침" = 09:00, "점심" = 12:00, "저녁" = 18:00, "밤" = 21:00
- "오전" = morning (AM), "오후" = afternoon (PM)
- "까지" indicates deadline
- If no specific time is mentioned, use 23:59 as default
- If no specific date is mentioned, use the current date
- Categorize the task: "work" (업무/과제/회의), "personal" (개인/약속/운동), "study" (공부/시험/학습), "other" (기타)

Return ONLY a JSON object with this exact format:
{
  "title": "Task title in Korean",
  "dueDate": "YYYY-MM-DD",
  "dueTime": "HH:MM",
  "category": "work|personal|study|other"
}

Examples:
- "내일 오후 3시까지 보고서 제출" → {"title": "보고서 제출", "dueDate": "TOMORROW_DATE", "dueTime": "15:00", "category": "work"}
- "모레 아침 운동하기" → {"title": "운동하기", "dueDate": "DAY_AFTER_TOMORROW", "dueTime": "09:00", "category": "personal"}
- "다음주 월요일까지 과제 완료" → {"title": "과제 완료", "dueDate": "NEXT_MONDAY", "dueTime": "23:59", "category": "study"}`;

    const response = await fetch(SOLAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'solar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Solar API error:', errorData);
      return NextResponse.json<ParseTodoResponse>(
        { success: false, error: 'AI 서비스 연결에 실패했습니다.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json<ParseTodoResponse>(
        { success: false, error: '응답을 받지 못했습니다.' },
        { status: 500 }
      );
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json<ParseTodoResponse>(
        { success: false, error: '투두 정보를 파싱할 수 없습니다.' },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!dateRegex.test(parsed.dueDate)) {
      return NextResponse.json<ParseTodoResponse>(
        { success: false, error: '올바른 날짜 형식이 아닙니다.' },
        { status: 500 }
      );
    }

    if (!timeRegex.test(parsed.dueTime)) {
      return NextResponse.json<ParseTodoResponse>(
        { success: false, error: '올바른 시간 형식이 아닙니다.' },
        { status: 500 }
      );
    }

    let warning: string | null = null;
    if (userPreferences) {
      if (isTimeInSleepRange(parsed.dueTime, userPreferences.sleepStart, userPreferences.sleepEnd)) {
        warning = `수면 시간(${userPreferences.sleepStart}~${userPreferences.sleepEnd})과 겹칩니다`;
      }
    }

    return NextResponse.json<ParseTodoResponse>({
      success: true,
      title: parsed.title,
      dueDate: parsed.dueDate,
      dueTime: parsed.dueTime,
      category: parsed.category || 'other',
      warning,
    });
  } catch (error) {
    console.error('Parse todo error:', error);
    return NextResponse.json<ParseTodoResponse>(
      { success: false, error: '투두 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
