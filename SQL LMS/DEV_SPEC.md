# 개발 스펙 — AI로 배우는 원데이 SQL (LMS)

**버전**: v1.0 (MVP)  
**작성일**: 2026-07-01

---

## 1. 기술 스택

| 레이어 | 기술 | 비고 |
|---|---|---|
| 프론트엔드 | React 19 + TypeScript + Vite | 기존 platter-worklab 스택 동일 |
| 스타일링 | Tailwind CSS | CDN 방식 |
| SQL 실행 | **sql.js (WebAssembly)** | 브라우저에서 SQLite 실행, 서버 불필요 |
| 데이터베이스 | **Supabase (PostgreSQL)** | Auth 내장, RLS 지원 |
| 인증 | **Supabase Auth** | 이메일 + 비밀번호 |
| 채점 API | **Supabase Edge Functions** | 정답 쿼리 서버 보관 및 서버 사이드 채점 |
| 호스팅 | **Vercel** | GitHub 연동 자동 배포 |
| 라우팅 | React Router DOM v7 | |

> **AI 미연동**: 쿼리 생성은 수강생이 외부 AI(ChatGPT, Claude 등)를 사용. 플랫폼 내 AI API 호출 없음 → 운영 비용 없음.

---

## 2. 시스템 아키텍처

```
학생 브라우저
    │
    ├─→ Vercel (프론트엔드 정적 파일)
    │       └─ React 앱 (sql.js 포함, 브라우저에서 SQL 즉시 실행)
    │
    ├─→ Supabase (DB + Auth)
    │       ├─ 로그인 / 화이트리스트 검증 (RLS)
    │       ├─ 문제 목록 / 챕터 조회
    │       └─ 풀이 기록(submissions) 저장
    │
    └─→ Supabase Edge Function: grade_submission
            ├─ 학생 쿼리 + problem_id 수신
            ├─ setup_sql + solution_sql 로드 (service key, 클라이언트 미노출)
            ├─ 서버에서 sql.js로 두 쿼리 실행
            └─ 결과 비교 후 {is_correct, actual_rows, expected_rows} 반환
```

---

## 3. URL / 라우팅 구조

```
/                          → 랜딩 + 로그인
/learn                     → 학습 대시보드 (문제 목록)
/learn/syntax/:chapterId   → 문법 챕터 문제 목록
/learn/cases/:domain       → 도메인별 케이스 문제 목록
/problem/:id               → 문제 풀이 페이지
/admin                     → 어드민 대시보드
/admin/problems            → 문제 목록 관리
/admin/problems/new        → 문제 등록
/admin/problems/:id/edit   → 문제 수정
/admin/whitelist           → 수강생 이메일 관리
```

---

## 4. DB 스키마

### 4-1. email_whitelist

```sql
CREATE TABLE email_whitelist (
  email      text PRIMARY KEY,
  note       text,               -- 수강생 이름, 기수 등
  added_at   timestamptz DEFAULT now()
);
```

### 4-2. chapters

```sql
CREATE TABLE chapters (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_num   int NOT NULL,
  track       text NOT NULL CHECK (track IN ('syntax', 'case')),
  domain      text,              -- track = 'case'인 경우 사용
  title       text NOT NULL,
  description text
);
```

### 4-3. problems

```sql
CREATE TABLE problems (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id             uuid REFERENCES chapters(id),
  track                  text NOT NULL CHECK (track IN ('syntax', 'case')),
  domain                 text,   -- 'ecommerce' | 'saas' | 'fintech' | 'logistics' | 'media' | 'hr' | 'community'
  difficulty             text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  title                  text NOT NULL,
  description            text,   -- 마크다운
  schema_description     text,   -- 학생에게 표시되는 스키마 설명
  setup_sql              text,   -- DDL + INSERT (클라이언트 전송 OK)
  grading_mode           text DEFAULT 'unordered' CHECK (grading_mode IN ('ordered', 'unordered')),
  expected_input_columns jsonb,  -- Track B: 정답 입력 컬럼 목록 (피드백용)
  tags                   text[],
  created_at             timestamptz DEFAULT now()
);
```

### 4-4. problem_solutions

```sql
-- solution_sql을 분리하여 admin-only RLS 적용
CREATE TABLE problem_solutions (
  problem_id   uuid PRIMARY KEY REFERENCES problems(id) ON DELETE CASCADE,
  solution_sql text NOT NULL
);
```

### 4-5. submissions

```sql
CREATE TABLE submissions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id),
  problem_id    uuid REFERENCES problems(id),
  submitted_sql text,
  is_correct    boolean,
  submitted_at  timestamptz DEFAULT now()
);
```

### 4-6. user_profiles

```sql
CREATE TABLE user_profiles (
  id        uuid PRIMARY KEY REFERENCES auth.users(id),
  is_admin  boolean DEFAULT false
);
```

---

## 5. RLS (Row Level Security) 정책

### email_whitelist

```sql
-- 인증된 사용자는 자신의 이메일이 목록에 있는지 확인 가능
CREATE POLICY "whitelist_self_check" ON email_whitelist
  FOR SELECT USING (email = auth.email());

-- 어드민만 전체 조회/추가/삭제 가능
CREATE POLICY "whitelist_admin_all" ON email_whitelist
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

### problems

```sql
-- 화이트리스트에 등록된 인증 사용자만 조회 가능
CREATE POLICY "problems_whitelist_read" ON problems
  FOR SELECT USING (
    auth.email() IN (SELECT email FROM email_whitelist)
  );

-- 어드민만 수정/삭제 가능
CREATE POLICY "problems_admin_write" ON problems
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

### problem_solutions

```sql
-- 어드민만 접근 가능 (클라이언트에서 절대 조회 불가)
CREATE POLICY "solutions_admin_only" ON problem_solutions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

### submissions

```sql
-- 본인 기록만 조회/추가 가능
CREATE POLICY "submissions_own" ON submissions
  FOR ALL USING (user_id = auth.uid());
```

---

## 6. Edge Function: grade_submission

### 역할

- 클라이언트에서 `submitted_sql` + `problem_id`를 수신
- 서버에서 `setup_sql` + `solution_sql`을 로드 (service key 사용)
- sql.js로 두 쿼리 실행 후 결과 비교
- `solution_sql`은 절대 클라이언트에 반환하지 않음

### 요청 / 응답

```typescript
// Request
POST /functions/v1/grade_submission
{
  problem_id: string,
  submitted_sql: string
}

// Response
{
  is_correct: boolean,
  actual_rows: Row[],        // 학생 쿼리 결과
  expected_rows: Row[],      // 정답 결과 (결과만 공개, 쿼리 미공개)
  error?: string             // SQL 오류 메시지
}
```

### 채점 로직

```
1. problem_id로 setup_sql, solution_sql, grading_mode 조회 (service key)
2. sql.js 인스턴스 생성 → setup_sql 실행 (테이블 생성 + 데이터 삽입)
3. submitted_sql 실행 → actual_rows 추출
4. solution_sql 실행 → expected_rows 추출
5. grading_mode에 따라 비교:
   - unordered: 양쪽 행을 정렬 후 JSON 비교
   - ordered: 순서 포함 직접 비교
6. is_correct 반환
```

---

## 7. 프론트엔드 컴포넌트 구조

```
src/
├── pages/
│   ├── Login.tsx
│   ├── Learn.tsx              # 대시보드 (문제 목록 + 필터)
│   ├── Problem.tsx            # 문제 풀이 (Track A/B 공통 라우트)
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── Problems.tsx       # 문제 목록
│       ├── ProblemForm.tsx    # 문제 등록/수정
│       └── Whitelist.tsx      # 수강생 관리
│
├── components/
│   ├── problem/
│   │   ├── SchemaExplorer.tsx        # 스키마 탐색기 (Track B)
│   │   ├── InputColumnSelector.tsx   # 컬럼 선택 (Track B STEP 1)
│   │   ├── OutputGridDesigner.tsx    # 아웃풋 그리드 (Track B STEP 2)
│   │   ├── PromptCopyButton.tsx      # AI 프롬프트 복사 (Track B STEP 3)
│   │   ├── SqlEditor.tsx             # SQL 에디터 (Track A/B 공통)
│   │   ├── ResultTable.tsx           # 실행 결과 표
│   │   └── GradingFeedback.tsx       # 정답/오답 피드백
│   │
│   └── common/
│       ├── Navbar.tsx
│       └── ProtectedRoute.tsx
│
├── lib/
│   ├── supabaseClient.ts
│   └── sqljs.ts               # sql.js 초기화 유틸
│
└── types/
    └── index.ts
```

---

## 8. 문제 풀이 페이지 레이아웃

### Track A (문법 실습)

```
┌─────────────────────────────────────────────┐
│  문제 제목 / 난이도 / 챕터                    │
├──────────────────────┬──────────────────────┤
│  문제 설명 (마크다운)  │  스키마 설명          │
├──────────────────────┴──────────────────────┤
│  SQL 에디터                                  │
│  [실행]  [채점]                              │
├─────────────────────────────────────────────┤
│  실행 결과 / 채점 피드백                       │
└─────────────────────────────────────────────┘
```

### Track B (AI 워크플로우)

```
┌─────────────────────────────────────────────────────────┐
│  문제 제목 / 난이도 / 도메인    [AI 워크플로우] [직접 작성] │
├───────────────────┬─────────────────────────────────────┤
│  스키마 탐색기     │  문제 설명                           │
│                   ├─────────────────────────────────────┤
│  📋 orders        │  STEP 1. 필요한 컬럼 선택             │
│   ☐ order_id      │  (스키마에서 체크한 컬럼 목록 표시)    │
│   ☑ user_id       │                                     │
│   ☑ created_at    │  STEP 2. 받을 표 그리기               │
│   ☐ amount        │  | 컬럼명 | 컬럼명 | [+ 추가]         │
│                   │  | 샘플값 | 샘플값 |                  │
│  📋 users         │  정렬 기준: ________ 예상 행 수: ___  │
│   ☑ user_id       │                                     │
│   ☐ name          │  STEP 3. AI에게 요청                 │
│                   │  [프롬프트 복사하기 📋]               │
│                   │                                     │
│                   │  STEP 4. 쿼리 붙여넣고 실행           │
│                   │  SQL 에디터                          │
│                   │  [실행]  [채점]                      │
│                   │  실행 결과 / 채점 피드백              │
└───────────────────┴─────────────────────────────────────┘
```

---

## 9. AI 프롬프트 자동 생성 포맷

`프롬프트 복사하기` 버튼 클릭 시 클립보드에 복사되는 내용:

```
아래 데이터베이스에서 SQLite 쿼리를 작성해주세요.

[문제]
{problem.description}

[데이터베이스 스키마]
{problem의 전체 테이블/컬럼 목록}

[내가 필요하다고 생각하는 테이블/컬럼]
{학생이 STEP 1에서 선택한 컬럼 목록}

[원하는 결과물]
{학생이 STEP 2에서 설계한 표 (컬럼명 + 샘플 행)}
정렬 기준: {입력값}

[요청]
위 조건에 맞는 SQLite 쿼리를 작성해주세요.
```

---

## 10. 보안 체크리스트

| 항목 | 위험도 | 대응 방법 |
|---|---|---|
| solution_sql 클라이언트 노출 | 높음 | problem_solutions 테이블 분리 + admin-only RLS + Edge Function에서만 참조 |
| 화이트리스트 우회 | 높음 | RLS 서버 강제 (클라이언트 체크만으로 불충분) |
| 어드민 페이지 무단 접근 | 높음 | user_profiles.is_admin RLS + 라우트 가드 |
| sql.js 무한루프 쿼리 | 낮음 | 5초 타임아웃 설정 (브라우저 탭만 영향, 서버 무관) |
| setup_sql 데이터 노출 | 낮음 | 허용 범위 (문제 데이터는 공개 정보) |
| 브루트포스 로그인 | 중간 | Supabase Auth 기본 rate limiting 활용 |

---

## 11. 비용 (MVP 기준, 수강생 ~50명)

| 서비스 | 무료 한도 | 예상 사용량 | 비용 |
|---|---|---|---|
| Vercel | 무제한 정적 배포 | 여유 | $0 |
| Supabase DB | 500MB | 수십 MB | $0 |
| Supabase Auth | 50,000 MAU | 50명 | $0 |
| Supabase Edge Functions | 500,000 calls/월 | ~10,000회 | $0 |
| AI API | 미연동 | 없음 | $0 |
| **합계** | | | **$0/월** |

> 수강생 500명 초과 또는 DB 500MB 초과 시 Supabase Pro($25/월) 전환 고려

---

## 12. 개발 순서 (MVP)

1. **프로젝트 세팅** — 새 GitHub 레포 + Vercel 연결 + Supabase 프로젝트 생성
2. **DB 스키마 + RLS** — 위 스키마 및 정책 적용
3. **인증** — 로그인 페이지 + 화이트리스트 검증 + 라우트 가드
4. **학습 대시보드** — 문제 목록 + 필터
5. **Track A 문제 풀이** — 에디터 + sql.js 실행 + Edge Function 채점
6. **Track B 문제 풀이** — 스키마 탐색기 + 컬럼 선택 + 아웃풋 그리드 + 프롬프트 복사
7. **어드민** — 문제 CRUD + 수강생 화이트리스트 관리
8. **문제 콘텐츠 등록** — 문법 챕터 + 도메인별 케이스 문제 입력
9. **배포** — 커스텀 도메인 연결 + 최종 테스트
