# SQL LMS — 배포 런북 (Deployment Runbook)

> 처음부터 새 환경에 배포하거나, 기존 배포를 유지보수할 때의 절차.
> 현재 프로덕션: **https://platter-worklab-ut7b.vercel.app**

---

## 0. 크리덴셜 위치 (리포에는 없음)

| 값 | 민감도 | 위치 |
|---|---|---|
| `VITE_SUPABASE_URL` | 공개 | Vercel 환경변수 / Supabase Settings→API (Project URL) |
| `VITE_SUPABASE_ANON_KEY` | 공개 | Vercel 환경변수 / Supabase Settings→API (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | **비밀** | 시드용 로컬 `.env.local`, Edge Function Secrets에만 |

> service_role key는 RLS를 우회하는 관리자 키. 로그/채팅/리포에 남기지 말 것.

---

## 1. Supabase 프로젝트

1. app.supabase.com → New project (Region: Seoul/Tokyo 권장)
2. Security 설정은 **기본값**(Data API on, auto-expose on, automatic RLS off) — 스키마가 RLS를 명시적으로 켬
3. Settings → API 에서 **Project URL / anon key / service_role key** 확보

## 2. 스키마 마이그레이션 (SQL Editor에 순서대로 실행)

1. `supabase/migrations/20240101000000_initial_schema.sql` — 7테이블 + RLS + 트리거
2. `supabase/migrations/20240102000000_fix_rls_recursion.sql` — **필수** RLS 버그 수정
   (이거 안 하면 로그인 후 "접근 권한 없음" + 문항 목록이 안 뜸)

## 3. Edge Function 배포 (Supabase 대시보드에서 수동)

- Edge Functions → 함수명 **`grade_submission`** 생성 → `supabase/functions/grade_submission/index.ts` 내용 붙여넣기 → Deploy
- Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  (셋 다 Supabase가 자동 주입하는 경우도 있음 — 이미 있으면 그대로)
- ⚠️ 이 함수는 **git 자동 배포 대상이 아님**. 코드 수정 시 대시보드에서 다시 Deploy.
- 핵심 구현 주의: Deno에서 `initSqlJs()` 를 인자 없이 부르면 wasm 로컬 경로를 못 찾아 **isolate가 abort → 503**.
  반드시 wasm 바이너리를 fetch해서 `wasmBinary`로 넘길 것 (현재 jsdelivr에서 fetch).

## 4. 시드 (로컬에서 실행, 261문항)

```bash
cd sql-lms
cat > .env.local <<'EOF'
VITE_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
EOF
npm install
npm run seed        # 데이터셋 8 + 챕터 10 + 문항 261
# 검증: SQL Editor에서 select count(*) from problems;  → 261
```

- 시드 구성: `seed.ts`(61) + `problems-extra.ts`(57) + `problems-extra2.ts`(143) = **261**
- Windows CMD면 `.env.local`은 메모장으로 생성 (heredoc 안 됨). `npm install`의 postinstall 경고는 무시 가능.

## 5. Vercel 프론트 배포

1. vercel.com → Add New → Project → GitHub `sekyuoh-platter/platter-worklab` import
2. **Root Directory = `sql-lms`** (필수! 루트로 두면 404 — 앱이 서브폴더에 있음)
3. Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - Vite 환경변수는 **빌드 타임에 박힘** → 변경 시 반드시 **재배포**
4. Production Branch = `main` (최신 UI는 없으면 기본 브랜치 = main 사용)

### 자동 배포가 안 걸릴 때 (겪었던 문제)
`main`에 머지했는데 Deployments에 새 배포가 안 뜨면:
- README 한 글자 수정 → main 직접 커밋 (연동/배포 트리거 테스트)
- 또는 Settings → Git → Disconnect 후 재Connect
- Redeploy는 "그 시점 커밋"을 다시 굽기 때문에 최신이 아닐 수 있음 → 최신 커밋 기준으로 트리거할 것

## 6. 첫 관리자 부트스트랩

1. Supabase → Authentication → Users → **Add user** (Auto Confirm User **켜기**, 비번 설정)
2. SQL Editor:
   ```sql
   INSERT INTO public.email_whitelist (email) SELECT email FROM auth.users;
   UPDATE public.user_profiles SET is_admin = true WHERE id IN (SELECT id FROM auth.users);
   ```
3. 사이트 `/login` 에서 해당 계정으로 로그인 → `/learn`, `/admin` 접근

## 7. 배포 필수 설정 (vercel.json / index.html)

- **COOP/COEP 헤더**: sql.js WASM 위해 필요 (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`)
- **SPA 리라이트**: `/(?!.*\.).*` → `/index.html` — **확장자 있는 경로(.wasm/.js/.css)는 제외**해야 함.
  전체(`/(.*)`)를 리라이트하면 `/sql-wasm-browser.wasm` 요청에 index.html(HTML)이 응답돼 WASM 컴파일 실패.
- **wasm 2개 배포**: 브라우저 빌드는 `sql-wasm-browser.wasm`을 요청. `public/`에 `sql-wasm.wasm` + `sql-wasm-browser.wasm` 둘 다 있어야 함 (postinstall `copy-wasm.mjs`가 복사, 커밋도 되어 있음).

## 8. 스모크 테스트 (배포 후)

- `/login` 로그인 → `/learn`에 261문항 + 필터 동작
- 문제 진입 → SQL 입력 → **Run** → 결과 테이블 (브라우저 sql.js)
- **Grade** → 정답/오답 판정 (Edge Function). 503이면 함수 로그 확인 (wasm 로드).
- `https://<도메인>/sql-wasm-browser.wasm` 직접 열어 200/바이너리인지 (404거나 HTML이면 리라이트/파일 누락)
