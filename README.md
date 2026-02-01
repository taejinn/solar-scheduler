<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite" alt="SQLite" />
</p>

<p align="center">
  <img src="https://cdn.prod.website-files.com/6743d5190bb2b52f38e99e37/6743f495cc3c0ed693e0b5f3_Logo_Black.png" alt="Upstage" height="40" />
</p>

<h1 align="center">
  Solar Scheduler
</h1>

<p align="center">
  <strong>Upstage Solar 기반 스마트 일정 관리</strong><br/>
  자연어로 일정을 입력하면 AI가 자동으로 분석하고 관리해줍니다
</p>

<p align="center">
  <a href="#-주요-기능">주요 기능</a> •
  <a href="#-시작하기">시작하기</a> •
  <a href="#-사용법">사용법</a> •
  <a href="#-기술-스택">기술 스택</a> •
  <a href="#-라이센스">라이센스</a>
</p>

---

## ✨ 주요 기능

### 🗣️ 자연어 일정 입력
복잡한 폼 대신, 평소 말하듯이 일정을 입력하세요.

```
"내일 오후 3시 팀 미팅"
"금요일까지 보고서 제출"
"다음주 월요일 아침 9시 운동"
```

AI가 자동으로 날짜, 시간, 카테고리를 분석합니다.

### 💬 Upstage Solar AI 어시스턴트
일정에 대해 자연스럽게 질문하세요.

| 질문 예시 | AI 응답 |
|----------|--------|
| "오늘 며칠이야?" | 오늘 날짜와 요일 안내 |
| "내일 일정 뭐있어?" | 내일 예정된 할 일 목록 |
| "이번주 할 일 알려줘" | 이번 주 전체 일정 요약 |
| "완료 안된 거 몇 개야?" | 미완료 일정 개수 |

### 🌙 수면 시간 보호
설정한 수면 시간과 겹치는 일정에는 경고가 표시됩니다.
건강한 일정 관리를 도와드립니다.

### 📅 다양한 뷰
- **월간 캘린더** - 한눈에 보는 월별 일정
- **목록 보기** - 할 일 중심의 깔끔한 목록

### ⚡ 빠른 검색
`Cmd+K` (Mac) / `Ctrl+K` (Windows)로 일정을 빠르게 검색하세요.

---

## 🚀 시작하기

### 사전 준비

#### 1. Node.js 설치

> 아직 Node.js가 없다면 먼저 설치해주세요.

**Mac / Windows**
1. [nodejs.org](https://nodejs.org) 접속
2. **LTS** 버전 다운로드 (왼쪽 초록색 버튼)
3. 다운로드된 파일 실행하여 설치

#### 2. Upstage Solar API 키 발급

> Upstage Solar AI 기능을 사용하려면 API 키가 필요합니다 (무료).

1. [console.upstage.ai](https://console.upstage.ai) 접속
2. 회원가입 또는 로그인
3. API 키 발급

---

### 설치 및 실행

#### 방법 1: 스크립트 실행 (권장)

**Mac / Linux**
```bash
# 1. 프로젝트 폴더로 이동
cd solar-scheduler

# 2. 실행 스크립트 시작
./start.sh
```

**Windows**
```
프로젝트 폴더에서 start.bat 더블클릭
```

#### 방법 2: 수동 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

### 초기 설정

1. 브라우저가 자동으로 열립니다 → `http://localhost:3000`
2. **Solar API 키** 입력 (위에서 발급받은 키)
3. **수면 시간** 설정
4. 완료! 🎉

---

## 📖 사용법

### 일정 추가하기

1. 좌측 사이드바에서 **"일정 만들기"** 클릭
2. 자연어로 일정 입력:
   - `내일 오후 3시 회의`
   - `다음주 금요일까지 프로젝트 마감`
   - `매주 월요일 아침 운동`
3. Upstage Solar가 자동 분석 후 캘린더에 추가

### Upstage Solar AI 어시스턴트 사용하기

1. 화면 우측 하단 **채팅 버튼** 클릭
2. 일정에 대해 자유롭게 질문:
   - `오늘 일정 알려줘`
   - `이번주 중요한 일 뭐야?`
   - `완료 안된 거 몇 개야?`

### 빠른 검색

- **Mac**: `Cmd + K`
- **Windows**: `Ctrl + K`

일정 제목으로 빠르게 검색할 수 있습니다.

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|-----|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4 |
| **Language** | TypeScript 5 |
| **Database** | SQLite (better-sqlite3) |
| **AI** | Upstage Solar API |
| **Icons** | Lucide React |

---

## 📁 프로젝트 구조

```
solar-scheduler/
├── app/
│   ├── api/                    # API 라우트
│   │   ├── chat/               # AI 채팅 API
│   │   ├── data/               # 데이터 CRUD API
│   │   ├── parse-todo/         # 자연어 파싱 API
│   │   └── validate-key/       # API 키 검증
│   ├── components/
│   │   ├── calendar/           # 캘린더 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── modals/             # 모달 컴포넌트
│   │   ├── ChatBot.tsx         # AI 채팅봇
│   │   └── Onboarding.tsx      # 초기 설정 위자드
│   ├── lib/                    # 유틸리티
│   └── page.tsx                # 메인 페이지
├── data/                       # SQLite 데이터베이스
├── start.sh                    # Mac/Linux 실행 스크립트
└── start.bat                   # Windows 실행 스크립트
```

---

## 💾 데이터 관리

### 저장 위치
모든 데이터는 로컬에 저장됩니다:
```
data/solar-scheduler.db
```

### 백업
데이터를 백업하려면 위 파일을 복사해두세요.

### 초기화
앱을 초기화하려면:
1. 앱 종료
2. `data/` 폴더 삭제
3. 앱 재시작

---

## ❓ 문제 해결

<details>
<summary><strong>"Node.js가 설치되어 있지 않습니다"</strong></summary>

[nodejs.org](https://nodejs.org)에서 LTS 버전을 설치해주세요.
</details>

<details>
<summary><strong>"API 키가 유효하지 않습니다"</strong></summary>

1. [console.upstage.ai](https://console.upstage.ai)에서 API 키 확인
2. 키를 복사할 때 앞뒤 공백 확인
3. 키가 만료되지 않았는지 확인
</details>

<details>
<summary><strong>포트 3000이 이미 사용 중</strong></summary>

다른 프로그램이 3000번 포트를 사용 중입니다:
- 해당 프로그램 종료
- 또는 `npm run dev -- -p 3001`로 다른 포트 사용
</details>

<details>
<summary><strong>터미널에서 start.sh 실행 오류 (Mac)</strong></summary>

```bash
chmod +x start.sh
./start.sh
```
</details>

---

## 🔧 개발

```bash
# 개발 서버 (핫 리로드)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start

# 린트 검사
npm run lint
```

---

## 📄 라이센스

MIT License

---

<p align="center">
  Powered by <a href="https://www.upstage.ai">Upstage Solar API</a>
</p>
