import { NextRequest, NextResponse } from 'next/server';
import { logRequest, logResponse, logApiCall, logApiResponse, logError } from '../../lib/logger';

const SOLAR_API_URL = 'https://api.upstage.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { apiKey } = await request.json();

    logRequest('POST', '/api/validate-key');

    if (!apiKey || typeof apiKey !== 'string') {
      logResponse('POST', '/api/validate-key', 400, Date.now() - startTime);
      return NextResponse.json(
        { success: false, error: 'API 키를 입력해주세요.' },
        { status: 400 }
      );
    }

    logApiCall('Solar', 'API 키 검증');
    const apiStartTime = Date.now();

    const response = await fetch(SOLAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'solar-pro',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 1,
      }),
    });

    if (!response.ok) {
      logApiResponse('Solar', false, Date.now() - apiStartTime);
      logResponse('POST', '/api/validate-key', 401, Date.now() - startTime);
      return NextResponse.json(
        { success: false, error: 'API 키가 유효하지 않습니다.' },
        { status: 401 }
      );
    }

    logApiResponse('Solar', true, Date.now() - apiStartTime);
    logResponse('POST', '/api/validate-key', 200, Date.now() - startTime);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('API 키 검증 오류', error);
    logResponse('POST', '/api/validate-key', 500, Date.now() - startTime);
    return NextResponse.json(
      { success: false, error: 'API 키 검증에 실패했습니다.' },
      { status: 500 }
    );
  }
}
