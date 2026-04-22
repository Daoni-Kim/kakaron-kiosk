# KAKARON — Team Order Kiosk

디저트 가게 **카카론(KAKARON)** 의 팀 주문 키오스크 웹앱입니다.
팀원들이 메뉴를 선택하면 실시간으로 전체 주문 현황이 동기화됩니다.

## 주요 기능

- 이름 입력 후 메뉴 선택 (1인 1메뉴, 변경/취소 가능)
- 마카롱 15종 + 다쿠아즈 5종 메뉴
- 실시간 주문 동기화 (Supabase Realtime)
- 주문 현황 대시보드 (통계, 인기 차트, 주문 목록)
- 주문 집계 클립보드 복사
- 날짜별 세션 자동 격리
- 관리자 페이지 (`#/admin`)
- 인터랙티브 배경 효과 (마우스 글로우, 파티클)

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| DB / Realtime | Supabase (PostgreSQL + Realtime) |
| Font | Bebas Neue, Montserrat, Noto Sans KR |

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local에 Supabase URL과 anon key 입력

# 개발 서버
npm run dev
```

## 환경변수

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Supabase 테이블 설정

`supabase/seed.sql` 파일을 Supabase SQL Editor에서 실행하세요.

## 페이지

| 경로 | 설명 |
|------|------|
| `/` | 키오스크 (메뉴 선택 + 주문 현황) |
| `/#/admin` | 관리자 (주문 조회, 삭제, 날짜별 히스토리) |

## 디자인

바니프레소 키오스크 스타일 — 딥 블랙(`#0A0A0A`) 배경에 형광 옐로우-그린(`#E8FF00`) 포인트 컬러.
