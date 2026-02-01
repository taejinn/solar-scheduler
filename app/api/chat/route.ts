import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse, Todo } from '../../types';
import { getApiKey } from '../../lib/db';
import { logRequest, logResponse, logApiCall, logApiResponse, logError } from '../../lib/logger';

const SOLAR_API_URL = 'https://api.upstage.ai/v1/chat/completions';

function formatTodoForPrompt(todo: Todo): string {
  const status = todo.completed ? '완료' : '미완료';
  return `- [${todo.title}] (마감: ${todo.dueDate} ${todo.dueTime}, 카테고리: ${todo.category}) [${status}]`;
}

function getDayName(date: Date): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ChatRequest = await request.json();
    const { message, todos, userPreferences, currentDate, currentTime } = body;

    logRequest('POST', '/api/chat', { message: message?.substring(0, 50) });

    if (!message) {
      logResponse('POST', '/api/chat', 400, Date.now() - startTime);
      return NextResponse.json<ChatResponse>(
        { success: false, error: '메시지를 입력해주세요.' },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      logError('API 키 미설정');
      logResponse('POST', '/api/chat', 500, Date.now() - startTime);
      return NextResponse.json<ChatResponse>(
        { success: false, error: 'API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.' },
        { status: 500 }
      );
    }

    const currentDateObj = new Date(currentDate);
    const dayName = getDayName(currentDateObj);

    const todoList = todos.length > 0
      ? todos.map(formatTodoForPrompt).join('\n')
      : '등록된 일정이 없습니다.';

    const sleepInfo = userPreferences
      ? `수면 시간: ${userPreferences.sleepStart} ~ ${userPreferences.sleepEnd}`
      : '수면 시간 미설정';

    const systemPrompt = `You are a helpful Korean schedule assistant. Answer questions about the user's schedule and time.

Current date: ${currentDate} (${dayName})
Current time: ${currentTime}
${sleepInfo}

User's todos:
${todoList}

Rules:
- ALWAYS answer in Korean
- Be concise and helpful
- For date questions, use the current date context
- For schedule questions, reference the todo list above
- If asked about "today's tasks" or "오늘 일정", filter todos with dueDate matching ${currentDate}
- If asked about "tomorrow" or "내일", calculate tomorrow's date from ${currentDate}
- If asked about "this week" or "이번주", consider the current week (Mon-Sun)
- Count completed/incomplete tasks accurately based on the 'completed' status
- Be friendly and use natural Korean expressions
- When listing todos, format them nicely with bullet points`;

    logApiCall('Solar', '채팅 응답 생성');
    const apiStartTime = Date.now();

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
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      logApiResponse('Solar', false, Date.now() - apiStartTime);
      logError('Solar API 오류', errorData);
      logResponse('POST', '/api/chat', 502, Date.now() - startTime);
      return NextResponse.json<ChatResponse>(
        { success: false, error: 'AI 서비스 연결에 실패했습니다.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    logApiResponse('Solar', true, Date.now() - apiStartTime);

    if (!content) {
      logResponse('POST', '/api/chat', 500, Date.now() - startTime);
      return NextResponse.json<ChatResponse>(
        { success: false, error: '응답을 받지 못했습니다.' },
        { status: 500 }
      );
    }

    logResponse('POST', '/api/chat', 200, Date.now() - startTime);
    return NextResponse.json<ChatResponse>({
      success: true,
      message: content.trim(),
    });
  } catch (error) {
    logError('채팅 처리 오류', error);
    logResponse('POST', '/api/chat', 500, Date.now() - startTime);
    return NextResponse.json<ChatResponse>(
      { success: false, error: '채팅 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
