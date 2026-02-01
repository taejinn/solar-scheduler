// 터미널 로깅 유틸리티

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // 전경색
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

function getTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function formatMethod(method: string): string {
  const methodColors: Record<string, string> = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    DELETE: colors.red,
  };
  return `${methodColors[method] || colors.white}${method}${colors.reset}`;
}

export function logRequest(method: string, path: string, body?: any) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  const methodStr = formatMethod(method);

  console.log(`${timestamp} ${colors.cyan}→${colors.reset} ${methodStr} ${path}`);

  if (body && Object.keys(body).length > 0) {
    // 민감한 정보 마스킹
    const safeBody = { ...body };
    if (safeBody.apiKey) {
      safeBody.apiKey = safeBody.apiKey.substring(0, 8) + '...';
    }
    if (safeBody.settings?.apiKey) {
      safeBody.settings.apiKey = safeBody.settings.apiKey.substring(0, 8) + '...';
    }
    console.log(`${colors.gray}   요청: ${JSON.stringify(safeBody).substring(0, 100)}${safeBody.toString().length > 100 ? '...' : ''}${colors.reset}`);
  }
}

export function logResponse(method: string, path: string, status: number, duration: number) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  const methodStr = formatMethod(method);

  const statusColor = status >= 200 && status < 300 ? colors.green :
                      status >= 400 && status < 500 ? colors.yellow :
                      status >= 500 ? colors.red : colors.white;

  console.log(`${timestamp} ${colors.magenta}←${colors.reset} ${methodStr} ${path} ${statusColor}${status}${colors.reset} ${colors.gray}(${duration}ms)${colors.reset}`);
}

export function logInfo(message: string) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  console.log(`${timestamp} ${colors.blue}ℹ${colors.reset} ${message}`);
}

export function logSuccess(message: string) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  console.log(`${timestamp} ${colors.green}✓${colors.reset} ${message}`);
}

export function logWarning(message: string) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  console.log(`${timestamp} ${colors.yellow}⚠${colors.reset} ${message}`);
}

export function logError(message: string, error?: any) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  console.log(`${timestamp} ${colors.red}✗${colors.reset} ${message}`);
  if (error) {
    console.log(`${colors.gray}   ${error.message || error}${colors.reset}`);
  }
}

export function logApiCall(service: string, action: string) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  console.log(`${timestamp} ${colors.cyan}🌐${colors.reset} ${colors.bright}${service}${colors.reset} API 호출: ${action}`);
}

export function logApiResponse(service: string, success: boolean, duration: number) {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  const status = success
    ? `${colors.green}성공${colors.reset}`
    : `${colors.red}실패${colors.reset}`;
  console.log(`${timestamp} ${colors.cyan}🌐${colors.reset} ${colors.bright}${service}${colors.reset} API 응답: ${status} ${colors.gray}(${duration}ms)${colors.reset}`);
}
