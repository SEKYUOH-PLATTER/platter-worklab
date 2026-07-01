/**
 * Grading engine validation test
 * Replicates the exact logic from supabase/functions/grade_submission/index.ts
 * Runs in Node.js with sql.js — no Supabase credentials required.
 */

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load sql.js for Node.js (CommonJS build with WASM)
const initSqlJs = require('sql.js')

// ─── Grading engine (mirror of edge function) ─────────────────────────────────

type QueryResult = { columns: string[]; values: unknown[][] }

function runInDb(setup: string, extra: string | null, query: string, SQL: any): QueryResult {
  const db = new SQL.Database()
  try {
    if (setup) db.run(setup)
    if (extra) db.run(extra)
    const results = db.exec(query)
    if (!results.length) return { columns: [], values: [] }
    return { columns: results[0].columns, values: results[0].values }
  } finally {
    db.close()
  }
}

function rowKey(row: unknown[]) {
  return JSON.stringify(row)
}

function normalize(values: unknown[][]): string[] {
  return values.map(rowKey).sort()
}

function grade(
  submitted: QueryResult,
  expected: QueryResult,
  mode: 'ordered' | 'unordered'
): boolean {
  if (submitted.columns.length !== expected.columns.length) return false
  if (submitted.values.length !== expected.values.length) return false
  if (mode === 'ordered') {
    return submitted.values.every((row, i) => rowKey(row) === rowKey(expected.values[i]))
  }
  const sn = normalize(submitted.values)
  const en = normalize(expected.values)
  return sn.every((r, i) => r === en[i])
}

// ─── Dataset setup SQLs ────────────────────────────────────────────────────────

const COMMUNITY_SETUP = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE,
  reputation INTEGER NOT NULL DEFAULT 0, role TEXT NOT NULL DEFAULT 'member',
  created_at TEXT NOT NULL, last_active TEXT NOT NULL
);
CREATE TABLE posts (
  id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
  category TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL,
  view_cnt INTEGER NOT NULL DEFAULT 0, upvote_cnt INTEGER NOT NULL DEFAULT 0,
  comment_cnt INTEGER NOT NULL DEFAULT 0, is_pinned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE comments (
  id INTEGER PRIMARY KEY, post_id INTEGER NOT NULL REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id), content TEXT NOT NULL,
  upvote_cnt INTEGER NOT NULL DEFAULT 0, is_accepted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, cnt INTEGER NOT NULL DEFAULT 0);
CREATE TABLE post_tags (post_id INTEGER NOT NULL REFERENCES posts(id), tag_id INTEGER NOT NULL REFERENCES tags(id), PRIMARY KEY (post_id, tag_id));
CREATE TABLE follows (follower_id INTEGER NOT NULL REFERENCES users(id), following_id INTEGER NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, PRIMARY KEY (follower_id, following_id));

INSERT INTO users VALUES
(1,'sqlmaster','sqlmaster@dev.kr',1850,'expert','2020-03-10','2024-03-20'),
(2,'pythonista','pythonista@dev.kr',1240,'expert','2020-06-15','2024-03-19'),
(3,'newbie_coder','newbie@dev.kr',120,'member','2023-05-20','2024-03-18'),
(4,'data_wizard','datawiz@dev.kr',980,'expert','2021-02-10','2024-03-20'),
(5,'frontend_dev','frontend@dev.kr',650,'member','2021-09-01','2024-03-17'),
(6,'backend_guru','backend@dev.kr',1120,'expert','2020-11-20','2024-03-20'),
(7,'ml_engineer','mlengineer@dev.kr',890,'member','2022-01-15','2024-03-16'),
(8,'devops_pro','devops@dev.kr',740,'member','2021-07-10','2024-03-19'),
(9,'ux_designer','uxdesign@dev.kr',320,'member','2022-08-05','2024-03-15'),
(10,'product_pm','pm@dev.kr',480,'member','2022-03-20','2024-03-18'),
(11,'security_hawk','security@dev.kr',1350,'expert','2020-09-01','2024-03-19'),
(12,'cloud_native','cloud@dev.kr',560,'member','2022-05-10','2024-03-17'),
(13,'junior_dev1','juniordev1@dev.kr',80,'member','2024-01-10','2024-03-16'),
(14,'junior_dev2','juniordev2@dev.kr',60,'member','2024-01-20','2024-03-15'),
(15,'moderator1','mod1@dev.kr',2100,'moderator','2019-12-01','2024-03-20');

INSERT INTO posts VALUES
(1,1,'Q&A','SQL GROUP BY HAVING','...',1250,45,8,0,'2024-01-10'),
(2,4,'정보공유','2024 데이터 분석가 로드맵','...',8900,234,56,1,'2024-01-15'),
(5,1,'정보공유','SQL 윈도우 함수 가이드','...',12000,389,67,1,'2024-01-25'),
(9,11,'정보공유','SQL Injection 방어','...',9200,312,58,1,'2024-02-10'),
(16,1,'정보공유','EXPLAIN으로 쿼리 성능 분석','...',5200,189,38,0,'2024-03-01'),
(25,1,'정보공유','CTE 활용법','...',6700,212,44,0,'2024-03-19');

INSERT INTO comments VALUES
(1,1,4,'WHERE는 행 필터링, HAVING은 그룹 필터링.',34,1,'2024-01-10'),
(6,5,2,'ROW_NUMBER, RANK, DENSE_RANK 차이도 중요.',45,0,'2024-01-25'),
(10,9,6,'Parameterized Query로 90% 방어.',67,0,'2024-02-10');

INSERT INTO tags VALUES (1,'SQL',45),(2,'Python',38),(10,'데이터분석',25);
INSERT INTO post_tags VALUES (1,1),(1,10),(5,1),(5,10),(9,1),(9,11);
INSERT INTO follows VALUES
(3,1,'2024-01-10'),(3,4,'2024-01-15'),(13,1,'2024-02-15'),
(2,1,'2020-06-20'),(6,1,'2020-11-25'),(4,1,'2021-02-15');
`

// ─── Test cases ───────────────────────────────────────────────────────────────

type TestCase = {
  name: string
  setup: string
  solution_sql: string
  submitted_sql: string
  mode: 'ordered' | 'unordered'
  expected_correct: boolean
}

const TESTS: TestCase[] = [
  // ── PASS: exact match ordered ────────────────────────────────────────────────
  {
    name: '[PASS] expert 유저 reputation 내림차순',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT username, reputation FROM users WHERE role='expert' ORDER BY reputation DESC`,
    submitted_sql: `SELECT username, reputation FROM users WHERE role='expert' ORDER BY reputation DESC`,
    mode: 'ordered',
    expected_correct: true,
  },
  // ── PASS: unordered set match ────────────────────────────────────────────────
  {
    name: '[PASS] 팔로워 3명 이상인 유저 (unordered)',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT following_id FROM follows GROUP BY following_id HAVING COUNT(*) >= 3`,
    submitted_sql: `SELECT following_id FROM follows GROUP BY following_id HAVING COUNT(follower_id) >= 3`,
    mode: 'unordered',
    expected_correct: true,
  },
  // ── PASS: aggregation with alias ─────────────────────────────────────────────
  {
    name: '[PASS] 댓글 수 집계',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT post_id, COUNT(*) AS cnt FROM comments GROUP BY post_id ORDER BY cnt DESC`,
    submitted_sql: `SELECT post_id, COUNT(*) AS cnt FROM comments GROUP BY post_id ORDER BY cnt DESC`,
    mode: 'ordered',
    expected_correct: true,
  },
  // ── FAIL: wrong ORDER BY ──────────────────────────────────────────────────────
  {
    name: '[FAIL] 정렬 방향 반대 (ordered should fail)',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT username, reputation FROM users WHERE role='expert' ORDER BY reputation DESC`,
    submitted_sql: `SELECT username, reputation FROM users WHERE role='expert' ORDER BY reputation ASC`,
    mode: 'ordered',
    expected_correct: false,
  },
  // ── FAIL: missing row ─────────────────────────────────────────────────────────
  {
    name: '[FAIL] WHERE 조건 누락으로 행 수 불일치',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT username FROM users WHERE role='expert'`,
    submitted_sql: `SELECT username FROM users`,
    mode: 'unordered',
    expected_correct: false,
  },
  // ── PASS: JOIN test ───────────────────────────────────────────────────────────
  {
    name: '[PASS] JOIN — 포스트별 작성자 이름',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT p.id, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.id`,
    submitted_sql: `SELECT posts.id, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.id`,
    mode: 'ordered',
    expected_correct: true,
  },
  // ── PASS: subquery ────────────────────────────────────────────────────────────
  {
    name: '[PASS] 서브쿼리 — 평균 이상 reputation 유저',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT username FROM users WHERE reputation > (SELECT AVG(reputation) FROM users) ORDER BY reputation DESC`,
    submitted_sql: `SELECT username FROM users WHERE reputation > (SELECT AVG(reputation) FROM users) ORDER BY reputation DESC`,
    mode: 'ordered',
    expected_correct: true,
  },
  // ── PASS: window function ────────────────────────────────────────────────────
  {
    name: '[PASS] 윈도우 함수 RANK',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT username, reputation, RANK() OVER (ORDER BY reputation DESC) AS rnk FROM users ORDER BY rnk`,
    submitted_sql: `SELECT username, reputation, RANK() OVER (ORDER BY reputation DESC) AS rnk FROM users ORDER BY rnk`,
    mode: 'ordered',
    expected_correct: true,
  },
  // ── PASS: CTE ────────────────────────────────────────────────────────────────
  {
    name: '[PASS] CTE — expert 유저 팔로워 수',
    setup: COMMUNITY_SETUP,
    solution_sql: `WITH experts AS (SELECT id FROM users WHERE role='expert') SELECT e.id, COUNT(f.follower_id) AS followers FROM experts e LEFT JOIN follows f ON f.following_id = e.id GROUP BY e.id ORDER BY followers DESC`,
    submitted_sql: `WITH experts AS (SELECT id FROM users WHERE role='expert') SELECT e.id, COUNT(f.follower_id) AS followers FROM experts e LEFT JOIN follows f ON f.following_id = e.id GROUP BY e.id ORDER BY followers DESC`,
    mode: 'ordered',
    expected_correct: true,
  },
  // ── FAIL: column count mismatch ───────────────────────────────────────────────
  {
    name: '[FAIL] 컬럼 수 불일치',
    setup: COMMUNITY_SETUP,
    solution_sql: `SELECT username, reputation FROM users WHERE role='expert'`,
    submitted_sql: `SELECT username FROM users WHERE role='expert'`,
    mode: 'unordered',
    expected_correct: false,
  },
]

// ─── Runner ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== SQL LMS Grading Engine Test ===\n')

  const SQL = await initSqlJs({
    locateFile: (file: string) => path.join(__dirname, '../node_modules/sql.js/dist', file),
  })

  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const tc of TESTS) {
    try {
      const submitted = runInDb(tc.setup, null, tc.submitted_sql, SQL)
      const expected = runInDb(tc.setup, null, tc.solution_sql, SQL)
      const result = grade(submitted, expected, tc.mode)
      const ok = result === tc.expected_correct

      if (ok) {
        console.log(`  ✓ ${tc.name}`)
        passed++
      } else {
        console.log(`  ✗ ${tc.name}`)
        console.log(`    expected is_correct=${tc.expected_correct}, got ${result}`)
        if (submitted.values.length <= 5) {
          console.log(`    submitted rows: ${JSON.stringify(submitted.values)}`)
          console.log(`    expected rows:  ${JSON.stringify(expected.values)}`)
        }
        failed++
        failures.push(tc.name)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`  ✗ ${tc.name} — EXCEPTION: ${msg}`)
      failed++
      failures.push(tc.name)
    }
  }

  console.log(`\n─── Results ───────────────────────────────`)
  console.log(`  Total:  ${TESTS.length}`)
  console.log(`  Passed: ${passed}`)
  console.log(`  Failed: ${failed}`)

  if (failed > 0) {
    console.log(`\nFailed tests:`)
    failures.forEach(f => console.log(`  - ${f}`))
    process.exit(1)
  } else {
    console.log('\n✓ All grading engine tests passed — core SQL execution and comparison logic is correct.')
    process.exit(0)
  }
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
