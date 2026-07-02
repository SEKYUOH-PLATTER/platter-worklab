# SQL LMS — 인수인계 / 프로젝트 상태 (Handoff)

> 이 문서는 **맥락이 전혀 없는 새 세션(사람 또는 AI)** 이 이 프로젝트를 이어받을 수 있도록
> 작성한 인수인계 문서입니다. 기획 의도는 `../../SQL LMS/PRD.md`, `../../SQL LMS/DEV_SPEC.md`
> 를, 배포 절차는 `./DEPLOYMENT.md`, 겪은 이슈는 `./ISSUES_LOG.md` 를 참고하세요.
>
> 최종 갱신: 2026-07 (MVP 배포 + 전체 UI 리디자인 완료 시점)

---

## 1. 한 줄 요약

브라우저에서 SQL을 직접 실행(sql.js/WASM)하고 서버에서 채점(Supabase Edge Function)하는,
**초대제(화이트리스트) SQL 학습 플랫폼(LMS)**. React SPA + Supabase 백엔드, Vercel 배포. **MVP 라이브 상태.**

## 2. 기술 스택

| 영역 | 스택 |
|---|---|
| 프론트엔드 | React 19, TypeScript, Vite 6, Tailwind CSS v3, React Router v7 |
| 브라우저 SQL | sql.js 1.12.0 (WebAssembly SQLite) — 문제 페이지에서 로컬 실행 |
| 백엔드 | Supabase — Auth(이메일/비번), Postgres + RLS, Edge Functions(Deno) |
| 채점 | Edge Function `grade_submission` (Deno에서 sql.js로 제출/정답 실행 후 비교) |
| 폰트/디자인 | Pretendard, 인디고 `#4F46E5` 액센트, 캔버스 `#F7F8FA` (Claude Design 기반) |
| 배포 | Vercel (프론트) + Supabase (백엔드) |

## 3. 리포지토리 구조 (핵심만)

```
platter-worklab/                    ← 리포 루트
├── sql-lms/                        ← 실제 앱 (Vercel Root Directory = sql-lms)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx           로그인 (초대제, 회원가입 없음)
│   │   │   ├── Learn.tsx           문제 목록 + 필터 + 진행률
│   │   │   ├── Problem.tsx         문제 풀이 (워크플로우/직접 모드)
│   │   │   └── admin/              AdminLayout, Problems, Datasets, Whitelist, *Form
│   │   ├── components/
│   │   │   ├── Navbar.tsx, ProtectedRoute.tsx
│   │   │   └── problem/            SqlEditor, ResultTable, GradingFeedback,
│   │   │                           SchemaExplorer, OutputGridDesigner, PromptCopyButton
│   │   ├── lib/                    sqljs.ts (WASM 초기화/실행), supabaseClient.ts
│   │   └── types/index.ts
│   ├── supabase/
│   │   ├── migrations/
│   │   │   ├── 20240101000000_initial_schema.sql      스키마 + RLS + 트리거
│   │   │   └── 20240102000000_fix_rls_recursion.sql   RLS 버그 수정(중요)
│   │   ├── functions/grade_submission/index.ts        채점 Edge Function
│   │   └── seeds/datasets/*.sql                        8개 데이터셋 setup SQL
│   ├── scripts/
│   │   ├── seed.ts, problems-extra.ts, problems-extra2.ts   시드(총 261문항)
│   │   ├── copy-wasm.mjs           postinstall: sql.js wasm → public/ (크로스플랫폼)
│   │   ├── test-grading.ts         채점 엔진 단위 테스트 (npm run test:grading)
│   │   └── verify-mvp.ts           MVP 완성도 체크 (npm run verify:mvp)
│   ├── public/                     sql-wasm.wasm, sql-wasm-browser.wasm, favicon.svg
│   ├── docs/                       ← 이 문서들 (HANDOFF/DEPLOYMENT/ISSUES_LOG)
│   ├── vercel.json                 COOP/COEP 헤더 + SPA 리라이트(확장자 제외)
│   └── index.html                  Pretendard 폰트 로드
├── SQL LMS/                        ← 기획 문서 (PRD.md, DEV_SPEC.md) — 폴더명에 공백
├── *.dc.html, support.js           ← Claude Design 목업 원본 (참고용)
└── (루트의 App.tsx, pages/ 등)     ← 무관한 옛 마케팅 사이트 잔재 (앱과 별개)
```

> ⚠️ 리포 루트에는 앱과 무관한 **옛 마케팅 사이트 파일**과 공백 폴더 `SQL LMS/`(기획문서)가
> 섞여 있습니다. 실제 앱은 오직 `sql-lms/` 입니다. Vercel Root Directory도 `sql-lms`.

## 4. 데이터 모델 (7 테이블)

`email_whitelist`, `user_profiles`, `datasets`, `chapters`, `problems`,
`problem_solutions`(정답 SQL — 학습자 RLS 차단), `submissions`.

- **트랙 A (`syntax`)**: 문법 실습, 단일 공용 데이터셋 `syntax_common`, 10개 챕터
- **트랙 B (`case`)**: 실전 케이스, 7개 도메인 데이터셋(ecommerce/saas/fintech/logistics/media/hr/community)
- 채점 모드: `ordered`(정확 순서) / `unordered`(정렬 후 비교)

### RLS 핵심 (반드시 이해할 것)
초기 스키마의 RLS에 **치명 버그 2개**가 있어 두 번째 마이그레이션으로 고쳤습니다:
- `user_profiles` 관리자 정책이 자기 자신을 조회 → 무한 재귀
- 정책이 `auth.users`를 직접 조회 → `authenticated` 역할 권한 없음 → 빈 결과

**해결**: SECURITY DEFINER 헬퍼 함수 사용 (재귀·auth.users 의존 제거):
- `public.is_admin()` — user_profiles를 owner 권한으로 읽음
- `public.is_whitelisted()` — email_whitelist 확인
- `public.current_email()` — `auth.jwt() ->> 'email'` (auth.users 대신 JWT에서 이메일)

→ 새로 RLS 정책을 만들 때도 **auth.users 직접 조회 금지, 위 헬퍼 사용**.

## 5. 현재 상태 (2026-07)

- ✅ 스키마/RLS/트리거 배포됨
- ✅ Edge Function `grade_submission` 배포됨 (Deno wasm 로드 이슈 해결)
- ✅ 시드 **261문항** + 8데이터셋 + 10챕터 삽입됨
- ✅ 프론트 Vercel 배포: **https://platter-worklab-ut7b.vercel.app**
- ✅ 전체 UI 라이트 테마 리디자인(Learn/Login/Problem/Admin) 완료
- ✅ 로그인 → 목록 → 문제풀이(Run) → 채점(Grade) end-to-end 동작 확인됨

## 6. 새 세션에서 이어가기 (체크리스트)

1. 작업 브랜치: **`claude/sql-learning-platform-k9irl4`** (모든 작업이 여기 → PR로 `main` 머지)
   - `main` = Vercel 프로덕션 소스. 머지하면 자동 배포(가끔 안 걸림 → DEPLOYMENT.md 참고)
2. 앱 디렉터리는 `sql-lms/`. `npm install` → `npm run dev` 로 로컬 실행.
   - 로컬 실행/시드엔 `.env.local` 필요 (DEPLOYMENT.md 참고, **git에 커밋 안 됨**)
3. 크리덴셜(anon/service_role key)은 **리포에 없음**. Vercel 환경변수 / Supabase 대시보드에 있음.
4. 빌드 검증: `npm run build`, 채점 로직: `npm run test:grading`, MVP 체크: `npm run verify:mvp`
5. Edge Function 수정 시 **Supabase 대시보드에서 수동 재배포** 필요 (Vercel과 별개, git으로 자동 배포 안 됨)

## 7. 알려진 한계 / v2.0 후보

기능은 동작하나 다듬을 여지가 있는 부분 (v2.0 기획 시 검토):

- **어드민 테이블**: 사이드바만 라이트 리디자인. 목록/폼(`admin.dc.html`의 표 스타일)은 기능 위주 라이트 상태 — 완전 이식 안 됨.
- **난이도 필터**: Learn에서 목업대로 단일 선택으로 변경(이전 다중). 다중이 나으면 되돌리기.
- **"받을 표 그리기"(Step 2)·예상 행 수**: 워크플로우의 학습 보조용일 뿐, 실제 채점엔 미반영.
- **회원가입 없음**: 초대제. 신규 계정은 Supabase 대시보드에서 수동 생성(Auth → Add user) 후 화이트리스트 등록.
- **번들 크기 >500KB**: 코드 스플리팅 없음 (sql.js 포함). 필요 시 dynamic import.
- **Edge Function wasm**: 콜드스타트마다 jsdelivr에서 wasm fetch (isolate당 캐시). 자체 호스팅/다른 sqlite 검토 여지.
- **리포 정리**: 루트의 옛 마케팅 사이트 잔재, 공백 폴더 `SQL LMS/`, 루트의 `*.dc.html` 정리 필요.
- **테스트**: `test-grading.ts`(채점 로직), `verify-mvp.ts`(정적 체크)뿐. UI/E2E 테스트 없음.
- **제출 이력/대시보드**: submissions는 쌓이지만 학습자용 통계 화면 없음.

## 8. 배포 토폴로지 한눈에

```
사용자 브라우저
  ├─ Vercel (React SPA, /learn /problem 등)  ── COOP/COEP 헤더, sql.js WASM 로컬 실행
  └─ Supabase
       ├─ Auth (이메일/비번 로그인)
       ├─ Postgres + RLS (문항/데이터셋/제출 등)
       └─ Edge Function grade_submission (Deno, service_role로 정답 조회 후 sql.js 채점)
```
