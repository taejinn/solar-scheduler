@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Solar Scheduler 시작 스크립트 (Windows)

echo.
echo ==========================================
echo     Solar Scheduler 시작
echo ==========================================
echo.

:: 스크립트 위치로 이동
cd /d "%~dp0"

:: Node.js 설치 확인
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo.
    echo Node.js를 먼저 설치해주세요:
    echo.
    echo   1. https://nodejs.org 접속
    echo   2. LTS 버전 다운로드
    echo   3. 설치 후 이 스크립트 다시 실행
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js 설치됨: %NODE_VERSION%

:: 의존성 설치
if not exist "node_modules" (
    echo.
    echo 의존성 설치 중... (처음 실행 시 1-2분 소요)
    call npm install
    if %errorlevel% neq 0 (
        echo [오류] 의존성 설치 실패
        pause
        exit /b 1
    )
    echo [OK] 의존성 설치 완료
) else (
    echo [OK] 의존성 이미 설치됨
)

:: 데이터 폴더 생성
if not exist "data" (
    mkdir data
    echo [OK] 데이터 폴더 생성됨
)

:: 빌드
if not exist ".next" (
    echo.
    echo 앱 빌드 중... (처음 실행 시 1-2분 소요)
    call npm run build
    if %errorlevel% neq 0 (
        echo [오류] 빌드 실패
        pause
        exit /b 1
    )
    echo [OK] 빌드 완료
) else (
    echo [OK] 빌드 이미 완료됨
)

echo.
echo ==========================================
echo 서버 시작 중...
echo ==========================================
echo.
echo 브라우저에서 다음 주소로 접속하세요:
echo   http://localhost:3000
echo.
echo 종료하려면 이 창을 닫거나 Ctrl+C를 누르세요.
echo.

:: 2초 후 브라우저 열기
start /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: 서버 실행
call npm start
