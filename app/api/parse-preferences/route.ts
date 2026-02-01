import { NextRequest, NextResponse } from 'next/server';
import { ParsePreferencesResponse } from '../../types';
import { getApiKey } from '../../lib/db';

const SOLAR_API_URL = 'https://api.upstage.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json<ParsePreferencesResponse>(
        { success: false, error: '텍스트를 입력해주세요.' },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json<ParsePreferencesResponse>(
        { success: false, error: 'API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a sleep time parser assistant. Extract the sleep time range from the user's natural language input.

Rules:
- Parse Korean time expressions (e.g., "새벽 1시" = 01:00, "아침 7시" = 07:00)
- "새벽" typically means early morning (00:00-06:00)
- "아침" typically means morning (06:00-09:00)
- "저녁" typically means evening (18:00-21:00)
- "밤" typically means night (21:00-24:00)
- If the user says "until" or "까지", that's the end time
- If the user says "from" or "부터", that's the start time

Return ONLY a JSON object with this exact format:
{
  "sleepStart": "HH:MM",
  "sleepEnd": "HH:MM"
}

Examples:
- "새벽 1시부터 7시까지 자요" → {"sleepStart": "01:00", "sleepEnd": "07:00"}
- "밤 11시부터 아침 6시까지 수면" → {"sleepStart": "23:00", "sleepEnd": "06:00"}
- "12시에 자서 8시에 일어나요" → {"sleepStart": "00:00", "sleepEnd": "08:00"}`;

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
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Solar API error:', errorData);
      return NextResponse.json<ParsePreferencesResponse>(
        { success: false, error: 'AI 서비스 연결에 실패했습니다.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json<ParsePreferencesResponse>(
        { success: false, error: '응답을 받지 못했습니다.' },
        { status: 500 }
      );
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json<ParsePreferencesResponse>(
        { success: false, error: '시간 정보를 파싱할 수 없습니다.' },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(parsed.sleepStart) || !timeRegex.test(parsed.sleepEnd)) {
      return NextResponse.json<ParsePreferencesResponse>(
        { success: false, error: '올바른 시간 형식이 아닙니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json<ParsePreferencesResponse>({
      success: true,
      sleepStart: parsed.sleepStart,
      sleepEnd: parsed.sleepEnd,
    });
  } catch (error) {
    console.error('Parse preferences error:', error);
    return NextResponse.json<ParsePreferencesResponse>(
      { success: false, error: '수면 시간 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
