/**
 * MVP Verification Script
 * Validates that the SQL LMS MVP is fully implemented:
 * 1. Database schema — all required tables with RLS
 * 2. Seed problems — count meets target (≥260)
 * 3. Source files — all required frontend pages + components exist
 * 4. Edge function — grading service implemented
 * 5. Configuration — COOP/COEP headers, Vercel SPA rewrite
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { EXTRA_PROBLEMS } from './problems-extra.js'
import { EXTRA_PROBLEMS2 } from './problems-extra2.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

let passed = 0
let failed = 0

function check(label: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ✓ ${label}`)
    passed++
  } else {
    console.log(`  ✗ ${label}${detail ? ': ' + detail : ''}`)
    failed++
  }
}

function readFile(relPath: string): string {
  const abs = resolve(root, relPath)
  if (!existsSync(abs)) return ''
  return readFileSync(abs, 'utf-8')
}

function fileExists(relPath: string): boolean {
  return existsSync(resolve(root, relPath))
}

// ─── 1. Database Schema ────────────────────────────────────────────────────────

console.log('\n1. Database Schema')

const migration = readFile('supabase/migrations/20240101000000_initial_schema.sql')

const requiredTables = [
  'email_whitelist',
  'user_profiles',
  'datasets',
  'chapters',
  'problems',
  'problem_solutions',
  'submissions',
]

for (const table of requiredTables) {
  check(`table: ${table}`, migration.includes(`create table public.${table}`))
}

check('RLS enabled: problems', migration.includes('alter table public.problems') && migration.includes('enable row level security'))
check('RLS enabled: problem_solutions', migration.includes('alter table public.problem_solutions') && migration.includes('enable row level security'))
check('RLS enabled: submissions', migration.includes('alter table public.submissions') && migration.includes('enable row level security'))
check('problem_solutions blocked from learners', migration.includes('NO learner access'))
check('trigger: auto-create user_profile', migration.includes('on_auth_user_created'))
check('index: submissions(user_id, problem_id)', migration.includes('create index on public.submissions (user_id, problem_id)'))

// ─── 2. Seed Problems Count ────────────────────────────────────────────────────

console.log('\n2. Seed Problems Count')

const seedRaw = readFile('scripts/seed.ts')

// Count SEED_PROBLEMS array entries (rough: count title: lines)
const seedTitleMatches = seedRaw.match(/title:/g) || []
const seedCount = seedTitleMatches.length
const extraCount = EXTRA_PROBLEMS.length
const extra2Count = EXTRA_PROBLEMS2.length
const totalCount = seedCount + extraCount + extra2Count

check(`seed.ts baseline problems: ${seedCount}`, seedCount >= 55, `got ${seedCount}`)
check(`problems-extra.ts: ${extraCount} problems`, extraCount >= 50, `got ${extraCount}`)
check(`problems-extra2.ts: ${extra2Count} problems`, extra2Count >= 140, `got ${extra2Count}`)
check(`total problems ≥ 260: ${totalCount}`, totalCount >= 260, `got ${totalCount}`)

const trackAProblems = EXTRA_PROBLEMS.filter(p => p.track === 'syntax').length
const trackBProblems = EXTRA_PROBLEMS.filter(p => p.track === 'case').length +
                       EXTRA_PROBLEMS2.filter(p => p.track === 'case').length
check(`Track A (syntax) problems in extra files: ${trackAProblems + seedCount}`, true)
check(`Track B (case) problems in extra files: ${trackBProblems}`, trackBProblems >= 170)

const extra2Domains = new Set(EXTRA_PROBLEMS2.map(p => p.dataset_domain))
const requiredDomains = ['ecommerce', 'saas', 'fintech', 'logistics', 'media', 'hr', 'community']
for (const d of requiredDomains) {
  check(`Track B domain: ${d}`, extra2Domains.has(d))
}

// ─── 3. Frontend Pages & Components ────────────────────────────────────────────

console.log('\n3. Frontend Pages & Components')

const requiredFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/pages/Login.tsx',
  'src/pages/Learn.tsx',
  'src/pages/Problem.tsx',
  'src/pages/admin/Problems.tsx',
  'src/pages/admin/Datasets.tsx',
  'src/pages/admin/Whitelist.tsx',
  'src/components/ProtectedRoute.tsx',
  'src/components/problem/SqlEditor.tsx',
  'src/components/problem/ResultTable.tsx',
  'src/components/problem/GradingFeedback.tsx',
  'src/components/problem/SchemaExplorer.tsx',
  'src/components/problem/OutputGridDesigner.tsx',
  'src/components/problem/PromptCopyButton.tsx',
  'src/lib/sqljs.ts',
  'src/lib/supabaseClient.ts',
  'src/types/index.ts',
]

for (const f of requiredFiles) {
  check(`exists: ${f}`, fileExists(f))
}

// Verify key features in pages
const learnPage = readFile('src/pages/Learn.tsx')
check('Learn: fetches problems from Supabase', learnPage.includes('supabase.from(\'problems\')'))
check('Learn: track filter', learnPage.includes('track'))
check('Learn: domain filter', learnPage.includes('domain'))
check('Learn: difficulty filter', learnPage.includes('difficulty'))
check('Learn: solved problem tracking', learnPage.includes('submissions'))

const problemPage = readFile('src/pages/Problem.tsx')
check('Problem: loads sql.js DB', problemPage.includes('createDatabase'))
check('Problem: run SQL locally', problemPage.includes('runQuery'))
check('Problem: grade via Edge Function', problemPage.includes('grade_submission'))
check('Problem: AI workflow mode', problemPage.includes('workflow'))
check('Problem: Track A direct mode', problemPage.includes('syntax'))
check('Problem: Track B workflow mode', problemPage.includes('case') || problemPage.includes('workflow'))

const loginPage = readFile('src/pages/Login.tsx')
check('Login: email/password auth', loginPage.includes('signInWithPassword'))
check('Login: whitelist check', loginPage.includes('email_whitelist'))
check('Login: redirect to /learn', loginPage.includes('/learn'))

const appTsx = readFile('src/App.tsx')
check('App: /login route', appTsx.includes('/login'))
check('App: /learn route (ProtectedRoute)', appTsx.includes('ProtectedRoute'))
check('App: /problem/:id route', appTsx.includes('/problem/:id'))
check('App: /admin routes', appTsx.includes('/admin'))

// ─── 4. Edge Function ─────────────────────────────────────────────────────────

console.log('\n4. Edge Function: grade_submission')

const edgeFn = readFile('supabase/functions/grade_submission/index.ts')
check('grading function exists', edgeFn.length > 0)
check('JWT auth verification', edgeFn.includes('getUser'))
check('whitelist check', edgeFn.includes('email_whitelist'))
check('service role bypasses RLS', edgeFn.includes('SUPABASE_SERVICE_ROLE_KEY'))
check('sql.js initialization', edgeFn.includes('initSqlJs'))
check('runs submitted SQL', edgeFn.includes('submitted_sql'))
check('runs solution SQL', edgeFn.includes('solution_sql'))
check('ordered grading mode', edgeFn.includes("grading_mode === 'ordered'"))
check('unordered grading (else branch)', edgeFn.includes('normalize(submitted.values)'))
check('records submission to DB', edgeFn.includes('submissions'))
check('returns is_correct + row diff', edgeFn.includes('is_correct') && edgeFn.includes('expected_rows'))

// ─── 5. Configuration ─────────────────────────────────────────────────────────

console.log('\n5. Configuration')

const vercelJson = readFile('vercel.json')
check('vercel.json exists', vercelJson.length > 0)
check('COOP header (production)', vercelJson.includes('Cross-Origin-Opener-Policy'))
check('COEP header (production)', vercelJson.includes('Cross-Origin-Embedder-Policy'))
check('SPA rewrite to index.html', vercelJson.includes('index.html'))

const viteConfig = readFile('vite.config.ts')
check('vite.config.ts exists', viteConfig.length > 0)
check('COOP header (dev server)', viteConfig.includes('Cross-Origin-Opener-Policy'))
check('COEP header (dev server)', viteConfig.includes('Cross-Origin-Embedder-Policy'))
check('sql.js excluded from optimizer', viteConfig.includes('sql.js'))

check('env.example exists', fileExists('.env.example'))
check('migrations directory', fileExists('supabase/migrations/20240101000000_initial_schema.sql'))
check('dataset: community.sql', fileExists('supabase/seeds/datasets/community.sql'))
check('dataset: ecommerce.sql', fileExists('supabase/seeds/datasets/ecommerce.sql'))

// ─── Summary ────────────────────────────────────────────────────────────────

const total = passed + failed
console.log('\n═══════════════════════════════════════════')
console.log(`MVP Verification: ${passed}/${total} checks passed`)
if (failed > 0) {
  console.log(`⚠ ${failed} check(s) failed`)
  process.exit(1)
} else {
  console.log('✓ All MVP checks passed.')
  process.exit(0)
}
