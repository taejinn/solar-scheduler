#!/bin/bash

# Solar Scheduler 시작 스크립트 (Mac/Linux)

set -e

echo ""
echo "=========================================="
echo "    Solar Scheduler 시작"
echo "=========================================="
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Node.js 설치 확인
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        echo -e "${GREEN}✓ Node.js 설치됨: $NODE_VERSION${NC}"
        return 0
    else
        echo -e "${RED}✗ Node.js가 설치되어 있지 않습니다.${NC}"
        echo ""
        echo "Node.js를 먼저 설치해주세요:"
        echo ""
        echo "  Mac (Homebrew):"
        echo "    brew install node"
        echo ""
        echo "  Mac (직접 다운로드):"
        echo "    https://nodejs.org 에서 LTS 버전 다운로드"
        echo ""
        echo "  Linux (Ubuntu/Debian):"
        echo "    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
        echo "    sudo apt-get install -y nodejs"
        echo ""
        exit 1
    fi
}

# 의존성 설치
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo ""
        echo -e "${YELLOW}의존성 설치 중... (처음 실행 시 1-2분 소요)${NC}"
        npm install
        echo -e "${GREEN}✓ 의존성 설치 완료${NC}"
    else
        echo -e "${GREEN}✓ 의존성 이미 설치됨${NC}"
    fi
}

# 데이터 폴더 생성
create_data_folder() {
    if [ ! -d "data" ]; then
        mkdir -p data
        echo -e "${GREEN}✓ 데이터 폴더 생성됨${NC}"
    fi
}

# 빌드
build_app() {
    if [ ! -d ".next" ]; then
        echo ""
        echo -e "${YELLOW}앱 빌드 중... (처음 실행 시 1-2분 소요)${NC}"
        npm run build
        echo -e "${GREEN}✓ 빌드 완료${NC}"
    else
        echo -e "${GREEN}✓ 빌드 이미 완료됨${NC}"
    fi
}

# 브라우저 열기
open_browser() {
    sleep 2
    URL="http://localhost:3000"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$URL"
        fi
    fi
}

# 메인 실행
main() {
    cd "$(dirname "$0")"

    check_node
    install_dependencies
    create_data_folder
    build_app

    echo ""
    echo "=========================================="
    echo -e "${GREEN}서버 시작 중...${NC}"
    echo "=========================================="
    echo ""
    echo "브라우저에서 다음 주소로 접속하세요:"
    echo -e "${GREEN}  http://localhost:3000${NC}"
    echo ""
    echo "종료하려면 Ctrl+C를 누르세요."
    echo ""

    # 백그라운드에서 브라우저 열기
    open_browser &

    # 서버 실행
    npm start
}

main
