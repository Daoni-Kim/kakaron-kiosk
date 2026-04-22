-- ══════════════════════════════════════════
-- KAKARON Kiosk — Supabase Schema & Seed
-- ══════════════════════════════════════════

-- 메뉴 테이블
create table if not exists menus (
  id         uuid primary key default gen_random_uuid(),
  category   text not null,          -- 'macaron' | 'dacquoise'
  name       text not null,
  icon       text not null,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz default now()
);

-- 주문 테이블
create table if not exists orders (
  id         uuid primary key default gen_random_uuid(),
  user_name  text not null,
  menu_id    text not null,           -- 메뉴 ID (mc-01, dq-01 등)
  session_id text not null,           -- 날짜별 세션 (예: '2026-04-22')
  created_at timestamptz default now(),
  unique(user_name, session_id)       -- 1인 1메뉴 제약
);

-- Realtime 활성화
alter publication supabase_realtime add table orders;

-- RLS 정책 (공개 접근 허용 — 팀 내부 사용)
alter table orders enable row level security;

create policy "Allow all access to orders"
  on orders for all
  using (true)
  with check (true);

-- ══════════════════════════════════════════
-- 메뉴 시드 데이터 (선택사항 — 앱에서 하드코딩 사용 중)
-- ══════════════════════════════════════════
insert into menus (category, name, icon, sort_order) values
  ('macaron', '소금바닐라',       '🫧', 1),
  ('macaron', '소금카라멜',       '🍯', 2),
  ('macaron', '오레오마스카포네', '🖤', 3),
  ('macaron', '황치즈',           '🧀', 4),
  ('macaron', '레드벨벳',         '❤️', 5),
  ('macaron', '말차생초콜렛',     '🌿', 6),
  ('macaron', '레몬크림',         '🍋', 7),
  ('macaron', '더블초코',         '🍫', 8),
  ('macaron', '산딸기',           '🍓', 9),
  ('macaron', '초코우유',         '🥛', 10),
  ('macaron', '블루베리요거트',   '🫐', 11),
  ('macaron', '우유초코칩',       '🍪', 12),
  ('macaron', '두바이피스타치오', '🫚', 13),
  ('macaron', '꿀자몽',           '🍊', 14),
  ('macaron', '고구마치즈케이크', '🍠', 15),
  ('dacquoise', '레몬크림',       '🍋', 1),
  ('dacquoise', '꿀고구마',       '🍠', 2),
  ('dacquoise', '카라멜피칸',     '🌰', 3),
  ('dacquoise', '앙버터',         '🧈', 4),
  ('dacquoise', '치즈와인무화과', '🍾', 5);
