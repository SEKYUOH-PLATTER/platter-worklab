# SQL LMS — 이슈 로그 (Issues & Decisions)

> MVP 구현·배포·리디자인 과정에서 실제로 겪은 문제와 원인·해결. 재발 방지 및 복기용.
> 커밋/PR 번호는 `sekyuoh-platter/platter-worklab` 기준.

---

### #1 시드 문항 수 목표
- **요구**: 애초 검토한 260문항 충족
- **결과**: seed.ts(61) + problems-extra.ts(57) + problems-extra2.ts(143) = **261** ✓

### #2 verify-mvp 문항 수 과다 집계
- **증상**: 검증 스크립트가 280으로 보고 (DB 실제 261)
- **원인**: seed.ts의 `title:` 문자열을 셌는데 데이터셋/챕터 title도 포함됨
- **해결**: 문항당 1:1인 `solution_sql:` 개수로 카운트 변경

### #3 Windows postinstall 실패
- **증상**: `npm install` 중 `cp ... 2>/dev/null || true` 가 Windows CMD에서 에러 (`cp`/`true` 없음)
- **해결**: `scripts/copy-wasm.mjs` (Node 기반 크로스플랫폼 복사)로 교체, 실패해도 install 안 깨짐

### #4 RLS 무한 재귀 + auth.users 접근 실패 ★ 중요
- **증상**: 로그인은 되는데 "접근 권한이 없습니다" + `/learn` 문항 목록 비어 있음. 데이터(화이트리스트/is_admin)는 정확한데도 앱에서 못 읽음
- **원인 (2가지)**:
  1. `user_profiles` 관리자 정책이 `user_profiles`를 다시 조회 → "infinite recursion detected in policy"
  2. 화이트리스트/읽기 정책이 `select ... from auth.users` 사용 → `authenticated` 역할은 auth.users SELECT 권한 없음 → 정책이 빈 결과
- **해결**: 마이그레이션 `20240102000000_fix_rls_recursion.sql`
  - SECURITY DEFINER 헬퍼 `is_admin()` / `is_whitelisted()` / `current_email()`(= `auth.jwt() ->> 'email'`)
  - 모든 정책을 헬퍼 기반으로 재작성 (재귀·auth.users 의존 제거)
- **교훈**: RLS 정책에서 **auth.users 직접 조회 금지**, JWT/헬퍼 사용. 같은 테이블을 참조하는 정책은 재귀 주의.

### #5 로그인 화이트리스트 통과 실패
- 실제 원인은 #4(RLS). 마이그레이션 적용 + 화이트리스트 이메일 정확 일치(대소문자/공백)로 해결.

### #6 SPA 리라이트가 정적 wasm 요청을 가로챔 ★ 중요
- **증상**: Run 클릭해도 무반응. 콘솔: `expected magic word 00 61 73 6d, found 3c 21 64 6f` (= `<!do` HTML)
- **원인**: `vercel.json`의 `/(.*) → /index.html` 리라이트가 `/sql-wasm-browser.wasm` 요청까지 index.html(HTML)로 응답 → WASM 컴파일 실패
- **해결**: 리라이트를 **확장자 없는 경로만** 매칭 (`/((?!.*\.).*)`). wasm/js/css는 정적 서빙. wasm에 `Content-Type: application/wasm` 명시.

### #7 브라우저 빌드가 요구하는 wasm 파일 누락 ★ 중요
- **증상**: #6 해결 후 `GET /sql-wasm-browser.wasm 404`
- **원인**: 번들된 sql.js **브라우저 빌드**는 `sql-wasm-browser.wasm`을 요청하는데 `public/`엔 `sql-wasm.wasm`만 있었음
- **해결**: `copy-wasm.mjs`가 `sql-wasm-browser.wasm` + `sql-wasm.wasm` 둘 다 복사, `sql-wasm-browser.wasm`도 커밋

### #8 Edge Function 채점 503 ★ 중요
- **증상**: Grade 클릭 시 "Failed to send a request to the Edge Function" + `503` + CORS 헤더 없음
- **로그**: `failed to asynchronously prepare wasm: NotFound: /sql.js@1.12.0/denonext/sql-wasm.wasm` → `Aborted(...)`
- **원인**: Deno에서 `initSqlJs()` 인자 없이 호출 → wasm을 로컬 경로에서 읽으려다 실패 → isolate **abort**(try/catch로도 못 잡음) → 503, CORS 헤더 없이 → 클라이언트엔 CORS 에러로 표시
- **해결**: wasm 바이너리를 `fetch('https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.wasm')` 후 `initSqlJs({ wasmBinary })` 로 직접 전달. isolate당 캐시. `Access-Control-Allow-Methods` 추가.

### #9 favicon 404
- `index.html`이 `/favicon.svg` 참조하나 파일 없음 → `public/favicon.svg`(SQL 실린더 아이콘) 추가.

### #10 Vercel 자동 배포/설정 이슈
- **Root Directory**: 처음에 `SQL LMS`(공백/대문자)로 잘못 설정 → 404. 실제 폴더는 `sql-lms` → 수정.
- **자동 배포 미트리거**: `main` 머지 후에도 Deployments에 새 배포 안 뜸 → README 커밋/재연결로 트리거. (Redeploy는 옛 커밋을 재사용할 수 있어 주의)
- **환경변수 누락 배포**: Vite 환경변수는 빌드 타임 주입 → 추가 후 반드시 재배포.

### #11 Claude Design MCP 인증 불가 (원격 웹 환경)
- **증상**: `DesignSync`(claude_design MCP)가 `/design-login` 필요 → 원격 웹 세션에선 대화형 터미널 없어 인증 불가
- **해결**: 디자인 파일(`*.dc.html`, `support.js`)을 GitHub에 업로드받아 `git pull` 후 **직접 React로 이식**.
  목업의 정적 HTML을 덮어쓰지 않고, 디자인 토큰/레이아웃만 컴포넌트에 반영하고 데이터/기능은 유지.

---

## 디자인 시스템 토큰 (리디자인 시 재사용)

- 액센트 인디고: `#4F46E5` (기본), `#4338CA` (진한/hover), `#EEF2FF` (선택 배경), `#C7D2FE`/`#E0E7FF` (테두리)
- 캔버스: `#F7F8FA` / 카드: 흰색 + 테두리 `#E7E8EC` + 그림자 `0 1px 2px rgba(16,24,40,.04)`
- 텍스트: `#18181B`(강), `#374151`, `#4B5563`, `#6B7280`, `#9CA3AF`(약)
- 난이도: Easy `#15803D`/`#ECFDF5`, Medium `#B45309`/`#FFFBEB`, Hard `#B91C1C`/`#FEF2F2`
- 폰트: Pretendard Variable (index.html에서 CDN 로드)
- 원본 목업: 리포 루트의 `learn.dc.html`, `login.dc.html`, `problem.dc.html`, `admin.dc.html`

## PR 이력 (main 머지)

- #1 MVP 전체 구현 (스키마/Edge/시드/프론트)
- #2 WASM 서빙(리라이트) + RLS 재귀 수정
- #3 sql-wasm-browser.wasm 배포 수정
- #4 favicon + 채점 wasm 로드 수정 (Edge Function wasmBinary)
- #5 Learn 페이지 리디자인
- #6 Login/Problem/Admin 리디자인
