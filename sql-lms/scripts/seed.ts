/**
 * 데이터셋 + 챕터 + 문제 시드 스크립트
 * 실행: npx tsx scripts/seed.ts
 * 필요 환경변수: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (.env.local)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { EXTRA_PROBLEMS } from './problems-extra.js'
import { EXTRA_PROBLEMS2 } from './problems-extra2.js'

config({ path: '.env.local' })

const __dir = dirname(fileURLToPath(import.meta.url))

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('환경변수 누락: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sb = createClient(supabaseUrl, serviceKey)

function readSql(filename: string) {
  return readFileSync(resolve(__dir, '../supabase/seeds/datasets', filename), 'utf-8')
}

// ── 챕터 ──────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  { order_num: 1,  title: 'SELECT 기초 — 원하는 컬럼만 꺼내기' },
  { order_num: 2,  title: 'WHERE — 조건으로 행 필터링' },
  { order_num: 3,  title: 'ORDER BY — 결과 정렬' },
  { order_num: 4,  title: '집계 함수 — COUNT, SUM, AVG, MAX, MIN' },
  { order_num: 5,  title: 'GROUP BY + HAVING — 그룹별 집계' },
  { order_num: 6,  title: 'JOIN — 테이블 연결하기' },
  { order_num: 7,  title: '서브쿼리 — 쿼리 안의 쿼리' },
  { order_num: 8,  title: 'CASE — 조건 분기' },
  { order_num: 9,  title: '윈도우 함수 — 행 간 관계 분석' },
  { order_num: 10, title: 'NULL 처리 — IS NULL, COALESCE, NULLIF' },
]

// ── 데이터셋 ──────────────────────────────────────────────────────────────────
const DATASETS = [
  { domain: 'syntax_common', title: '문법 실습 공용 데이터셋',             description: '고객·상품·주문 3개 테이블로 구성된 문법 실습 전용 데이터셋', file: 'syntax_common.sql' },
  { domain: 'ecommerce',     title: '이커머스 기본 데이터셋',              description: '유저·상품·주문·주문상세·리뷰 5개 테이블의 온라인 쇼핑몰 데이터',  file: 'ecommerce.sql' },
  { domain: 'saas',          title: 'SaaS 비즈니스 데이터셋',              description: '기업·유저·구독·이벤트 4개 테이블의 B2B SaaS 플랫폼 데이터',      file: 'saas.sql' },
  { domain: 'fintech',       title: '핀테크 금융 데이터셋',                description: '유저·계좌·거래·카드 4개 테이블의 모바일 금융 서비스 데이터',       file: 'fintech.sql' },
  { domain: 'logistics',     title: '물류/SCM 데이터셋',                   description: '창고·상품·재고·배송·배송항목 5개 테이블의 물류 관리 시스템 데이터', file: 'logistics.sql' },
  { domain: 'media',         title: '미디어/콘텐츠 플랫폼 데이터셋',       description: '크리에이터·영상·조회·댓글·구독 5개 테이블의 동영상 플랫폼 데이터',  file: 'media.sql' },
  { domain: 'hr',            title: 'HR/인사 관리 데이터셋',               description: '부서·직원·근태·성과평가·휴가 5개 테이블의 인사 시스템 데이터',      file: 'hr.sql' },
  { domain: 'community',     title: '커뮤니티/게시판 데이터셋',            description: '유저·게시글·댓글·태그·팔로우 5개 테이블의 개발자 커뮤니티 데이터',   file: 'community.sql' },
]

// ── 문제 ──────────────────────────────────────────────────────────────────────
// chapters와 datasets는 DB에 삽입 후 ID를 받아 아래에서 사용합니다.
function buildProblems(
  chapterMap: Record<number, string>,   // order_num → id
  datasetMap: Record<string, string>,   // domain → id
) {
  const syntaxId = datasetMap['syntax_common']
  const c = chapterMap

  return [
    // ── TRACK A: 문법 실습 ────────────────────────────────────────────────────
    // Chapter 1 — SELECT 기초
    {
      title: '모든 고객 조회',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[1],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['select'],
      description: `customers 테이블에서 모든 컬럼의 데이터를 조회하세요.`,
      solution_sql: `SELECT * FROM customers;`,
    },
    {
      title: '고객 이름과 도시만 조회',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[1],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['select'],
      description: `customers 테이블에서 name과 city 컬럼만 조회하세요.`,
      solution_sql: `SELECT name, city FROM customers;`,
    },
    {
      title: '중복 제거: 도시 목록',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[1],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['select', 'distinct'],
      description: `customers 테이블에서 도시(city) 목록을 중복 없이 조회하세요.`,
      solution_sql: `SELECT DISTINCT city FROM customers;`,
    },
    {
      title: '컬럼 별칭 사용',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[1],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['select', 'alias'],
      description: `products 테이블에서 name을 "상품명", price를 "판매가"라는 별칭으로 조회하세요.`,
      solution_sql: `SELECT name AS 상품명, price AS 판매가 FROM products;`,
    },
    // Chapter 2 — WHERE
    {
      title: '서울 고객 필터링',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[2],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['where'],
      description: `customers 테이블에서 city가 '서울'인 고객의 모든 정보를 조회하세요.`,
      solution_sql: `SELECT * FROM customers WHERE city = '서울';`,
    },
    {
      title: '가격 범위 필터링',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[2],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['where', 'between'],
      description: `products 테이블에서 price가 50000 이상 150000 이하인 상품을 조회하세요.`,
      solution_sql: `SELECT * FROM products WHERE price BETWEEN 50000 AND 150000;`,
    },
    {
      title: 'VIP / Platinum 고객 조회',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[2],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['where', 'in'],
      description: `customers 테이블에서 grade가 'vip' 또는 'platinum'인 고객의 name과 grade를 조회하세요.`,
      solution_sql: `SELECT name, grade FROM customers WHERE grade IN ('vip', 'platinum');`,
    },
    {
      title: '취소·대기 주문 제외',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[2],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['where', 'not in'],
      description: `orders 테이블에서 status가 'cancelled'도 아니고 'pending'도 아닌 주문을 조회하세요.`,
      solution_sql: `SELECT * FROM orders WHERE status NOT IN ('cancelled', 'pending');`,
    },
    // Chapter 3 — ORDER BY
    {
      title: '비싼 상품 순으로 정렬',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[3],
      difficulty: 'easy', grading_mode: 'ordered', tags: ['order_by'],
      description: `products 테이블에서 모든 상품을 price 기준 내림차순으로 조회하세요.`,
      solution_sql: `SELECT * FROM products ORDER BY price DESC;`,
    },
    {
      title: '최근 주문 순으로 조회',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[3],
      difficulty: 'easy', grading_mode: 'ordered', tags: ['order_by'],
      description: `orders 테이블에서 ordered_at 기준 최신 순으로 모든 주문을 조회하세요.`,
      solution_sql: `SELECT * FROM orders ORDER BY ordered_at DESC;`,
    },
    {
      title: '카테고리 오름차순, 가격 내림차순',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[3],
      difficulty: 'medium', grading_mode: 'ordered', tags: ['order_by'],
      description: `products 테이블에서 category 오름차순, 같은 카테고리 내에서는 price 내림차순으로 조회하세요.`,
      solution_sql: `SELECT * FROM products ORDER BY category ASC, price DESC;`,
    },
    // Chapter 4 — 집계함수
    {
      title: '전체 고객 수',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[4],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['count'],
      description: `customers 테이블의 전체 고객 수를 조회하세요. 컬럼명은 total_customers로 지정하세요.`,
      solution_sql: `SELECT COUNT(*) AS total_customers FROM customers;`,
    },
    {
      title: '완료된 주문의 총 매출',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[4],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['sum', 'where'],
      description: `orders 테이블에서 status가 'completed'인 주문의 total_price 합계를 total_revenue로 조회하세요.`,
      solution_sql: `SELECT SUM(total_price) AS total_revenue FROM orders WHERE status = 'completed';`,
    },
    {
      title: '상품 최고가·최저가·평균가',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[4],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['max', 'min', 'avg'],
      description: `products 테이블에서 price의 최댓값(max_price), 최솟값(min_price), 평균값(avg_price)을 한 행으로 조회하세요.`,
      solution_sql: `SELECT MAX(price) AS max_price, MIN(price) AS min_price, ROUND(AVG(price), 0) AS avg_price FROM products;`,
    },
    // Chapter 5 — GROUP BY + HAVING
    {
      title: '카테고리별 상품 수',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[5],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['group_by', 'count'],
      description: `products 테이블에서 category별 상품 수(cnt)를 조회하세요.`,
      solution_sql: `SELECT category, COUNT(*) AS cnt FROM products GROUP BY category;`,
    },
    {
      title: '도시별 고객 수 — 3명 이상만',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[5],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['group_by', 'having'],
      description: `customers 테이블에서 city별 고객 수를 구하되, 3명 이상인 도시만 조회하세요. (컬럼명: city, cnt)`,
      solution_sql: `SELECT city, COUNT(*) AS cnt FROM customers GROUP BY city HAVING COUNT(*) >= 3;`,
    },
    {
      title: '고객별 총 주문 금액',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[5],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['group_by', 'sum'],
      description: `orders 테이블에서 customer_id별 total_price 합계(total_spent)를 구하고, 많이 쓴 순으로 정렬하세요.`,
      solution_sql: `SELECT customer_id, SUM(total_price) AS total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC;`,
    },
    // Chapter 6 — JOIN
    {
      title: '주문에 고객 이름 붙이기',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[6],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['join', 'inner_join'],
      description: `orders 테이블과 customers 테이블을 조인하여 주문별로 고객 이름(name)과 총 금액(total_price)을 조회하세요.`,
      solution_sql: `SELECT o.id, c.name, o.total_price FROM orders o JOIN customers c ON o.customer_id = c.id;`,
    },
    {
      title: '주문 없는 고객 찾기',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[6],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['left_join', 'null'],
      description: `주문이 한 번도 없는 고객의 name과 email을 조회하세요.`,
      solution_sql: `SELECT c.name, c.email FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;`,
    },
    {
      title: '주문 상품 이름 조회',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[6],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['join'],
      description: `orders와 products를 조인하여 주문 id, 상품명(name), 수량(quantity), 주문 금액(total_price)을 조회하세요.`,
      solution_sql: `SELECT o.id, p.name, o.quantity, o.total_price FROM orders o JOIN products p ON o.product_id = p.id;`,
    },
    // Chapter 7 — 서브쿼리
    {
      title: '평균가보다 비싼 상품',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[7],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['subquery'],
      description: `products 테이블에서 price가 전체 평균보다 비싼 상품의 name과 price를 조회하세요.`,
      solution_sql: `SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);`,
    },
    {
      title: '가장 많이 주문한 고객',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[7],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['subquery', 'group_by'],
      description: `orders 테이블에서 주문 횟수가 가장 많은 customer_id와 주문 수(order_cnt)를 조회하세요.`,
      solution_sql: `SELECT customer_id, COUNT(*) AS order_cnt FROM orders GROUP BY customer_id ORDER BY order_cnt DESC LIMIT 1;`,
    },
    {
      title: '주문한 적 있는 고객',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[7],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['subquery', 'exists'],
      description: `customers 테이블에서 orders에 한 건 이상 주문이 있는 고객의 name을 조회하세요. (EXISTS 사용)`,
      solution_sql: `SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    },
    // Chapter 8 — CASE
    {
      title: '등급 레이블 붙이기',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[8],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['case'],
      description: `customers 테이블에서 name과 grade를 조회하되, grade가 'platinum'이면 'VIP 최상위', 'vip'이면 'VIP', 나머지는 '일반'으로 출력하세요. 컬럼명은 grade_label로 지정하세요.`,
      solution_sql: `SELECT name, CASE WHEN grade = 'platinum' THEN 'VIP 최상위' WHEN grade = 'vip' THEN 'VIP' ELSE '일반' END AS grade_label FROM customers;`,
    },
    {
      title: '가격대 분류',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[8],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['case'],
      description: `products 테이블에서 name, price와 함께, price가 100000 초과이면 '고가', 50000 초과이면 '중가', 나머지는 '저가'로 분류한 price_tier를 조회하세요.`,
      solution_sql: `SELECT name, price, CASE WHEN price > 100000 THEN '고가' WHEN price > 50000 THEN '중가' ELSE '저가' END AS price_tier FROM products;`,
    },
    // Chapter 9 — 윈도우함수
    {
      title: '고객별 주문 순번',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[9],
      difficulty: 'medium', grading_mode: 'ordered', tags: ['window', 'row_number'],
      description: `orders 테이블에서 customer_id별로 ordered_at 순서로 주문 번호(order_rank)를 매겨 customer_id, ordered_at, order_rank를 조회하세요.`,
      solution_sql: `SELECT customer_id, ordered_at, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY ordered_at) AS order_rank FROM orders;`,
    },
    {
      title: '카테고리 내 가격 순위',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[9],
      difficulty: 'medium', grading_mode: 'unordered', tags: ['window', 'rank'],
      description: `products 테이블에서 category별로 price 내림차순 순위(price_rank)를 매겨 name, category, price, price_rank를 조회하세요.`,
      solution_sql: `SELECT name, category, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank FROM products;`,
    },
    {
      title: '누적 매출 계산',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[9],
      difficulty: 'hard', grading_mode: 'ordered', tags: ['window', 'sum'],
      description: `orders 테이블에서 ordered_at 순으로 정렬하여 누적 total_price(running_total)를 함께 조회하세요. (completed 주문만)`,
      solution_sql: `SELECT id, ordered_at, total_price, SUM(total_price) OVER (ORDER BY ordered_at) AS running_total FROM orders WHERE status = 'completed' ORDER BY ordered_at;`,
    },
    // Chapter 10 — NULL 처리
    {
      title: 'NULL 설명 처리',
      track: 'syntax', domain: null, dataset_id: syntaxId, chapter_id: c[10],
      difficulty: 'easy', grading_mode: 'unordered', tags: ['null', 'coalesce'],
      description: `products 테이블의 name과 category를 조회하는데, category가 NULL이면 '미분류'로 표시하세요. (COALESCE 사용)`,
      solution_sql: `SELECT name, COALESCE(category, '미분류') AS category FROM products;`,
    },

    // ── TRACK B: 이커머스 ───────────────────────────────────────────────────
    {
      title: '카테고리별 총 매출 및 주문 수',
      track: 'case', domain: 'ecommerce', dataset_id: datasetMap['ecommerce'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['group_by', 'join', 'sum'],
      description: `상품 카테고리별로 총 판매 금액(total_revenue)과 주문 건수(order_cnt)를 구하세요.\n- order_items와 products를 조인하세요.\n- total_revenue 내림차순으로 정렬하세요.`,
      solution_sql: `SELECT p.category, SUM(oi.quantity * oi.unit_price) AS total_revenue, COUNT(DISTINCT oi.order_id) AS order_cnt FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.category ORDER BY total_revenue DESC;`,
    },
    {
      title: '최근 3개월 월별 매출 추이',
      track: 'case', domain: 'ecommerce', dataset_id: datasetMap['ecommerce'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'ordered',
      tags: ['group_by', 'date', 'sum'],
      description: `2024년 1월~3월 월별 총 매출(total_revenue)을 조회하세요.\n- status가 'completed'인 주문만 포함하세요.\n- 월(month), total_revenue 형식으로 출력하세요.`,
      solution_sql: `SELECT STRFTIME('%Y-%m', created_at) AS month, SUM(total_amount) AS total_revenue FROM orders WHERE status = 'completed' AND created_at >= '2024-01-01' GROUP BY month ORDER BY month;`,
    },
    {
      title: '재구매 고객 식별',
      track: 'case', domain: 'ecommerce', dataset_id: datasetMap['ecommerce'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['group_by', 'having', 'subquery'],
      description: `2회 이상 주문한 고객의 user_id와 주문 횟수(order_cnt)를 조회하세요.\n- cancelled, refunded 주문은 제외하세요.`,
      solution_sql: `SELECT user_id, COUNT(*) AS order_cnt FROM orders WHERE status NOT IN ('cancelled', 'refunded') GROUP BY user_id HAVING COUNT(*) >= 2;`,
    },
    {
      title: '고객별 평균 평점 및 리뷰 수',
      track: 'case', domain: 'ecommerce', dataset_id: datasetMap['ecommerce'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['group_by', 'avg', 'join'],
      description: `각 상품의 이름(name), 평균 평점(avg_rating), 리뷰 수(review_cnt)를 조회하세요.\n- 리뷰가 없는 상품은 제외하세요.\n- avg_rating은 소수점 1자리로 반올림하세요.`,
      solution_sql: `SELECT p.name, ROUND(AVG(r.rating), 1) AS avg_rating, COUNT(*) AS review_cnt FROM reviews r JOIN products p ON r.product_id = p.id GROUP BY p.id, p.name ORDER BY avg_rating DESC;`,
    },
    {
      title: '상품별 수익률 계산',
      track: 'case', domain: 'ecommerce', dataset_id: datasetMap['ecommerce'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['join', 'arithmetic', 'order_by'],
      description: `상품별로 name, 판매가(price), 원가(cost_price), 수익률(margin_pct)을 조회하세요.\n- margin_pct = ROUND((price - cost_price) * 100.0 / price, 1)\n- 수익률 내림차순 정렬`,
      solution_sql: `SELECT name, price, cost_price, ROUND((price - cost_price) * 100.0 / price, 1) AS margin_pct FROM products ORDER BY margin_pct DESC;`,
    },
    {
      title: 'VIP 고객의 구매 패턴',
      track: 'case', domain: 'ecommerce', dataset_id: datasetMap['ecommerce'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'where'],
      description: `grade가 'vip'인 고객의 구매 정보를 분석하세요.\n- 고객별 총 주문 금액(total_spent), 평균 주문 금액(avg_order_value), 주문 횟수(order_cnt)를 출력하세요.\n- total_spent 내림차순 정렬`,
      solution_sql: `SELECT u.name, COUNT(o.id) AS order_cnt, SUM(o.total_amount) AS total_spent, ROUND(AVG(o.total_amount), 0) AS avg_order_value FROM users u JOIN orders o ON u.id = o.user_id WHERE u.grade = 'vip' GROUP BY u.id, u.name ORDER BY total_spent DESC;`,
    },

    // ── TRACK B: SaaS ───────────────────────────────────────────────────────
    {
      title: '플랜별 기업 수 및 총 MRR',
      track: 'case', domain: 'saas', dataset_id: datasetMap['saas'],
      chapter_id: null, difficulty: 'easy', grading_mode: 'unordered',
      tags: ['group_by', 'count', 'sum'],
      description: `companies 테이블에서 플랜(plan)별 기업 수(company_cnt)와 총 MRR 합계(total_mrr)를 조회하세요.\n- churned_at이 NULL인 활성 기업만 포함하세요.`,
      solution_sql: `SELECT plan, COUNT(*) AS company_cnt, SUM(mrr) AS total_mrr FROM companies WHERE churned_at IS NULL GROUP BY plan ORDER BY total_mrr DESC;`,
    },
    {
      title: '이탈(Churn) 기업 비율',
      track: 'case', domain: 'saas', dataset_id: datasetMap['saas'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['case', 'group_by', 'arithmetic'],
      description: `전체 기업 중 churned_at이 있는 이탈 기업 수(churned_cnt), 전체 기업 수(total_cnt), 이탈률(churn_rate_pct)을 조회하세요.\n- churn_rate_pct = ROUND(churned_cnt * 100.0 / total_cnt, 1)`,
      solution_sql: `SELECT COUNT(*) AS total_cnt, SUM(CASE WHEN churned_at IS NOT NULL THEN 1 ELSE 0 END) AS churned_cnt, ROUND(SUM(CASE WHEN churned_at IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS churn_rate_pct FROM companies;`,
    },
    {
      title: '기업당 평균 유저 수',
      track: 'case', domain: 'saas', dataset_id: datasetMap['saas'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'avg'],
      description: `플랜(plan)별로 기업당 평균 유저 수(avg_users_per_company)를 조회하세요.\n- users와 companies를 조인하세요.`,
      solution_sql: `SELECT c.plan, ROUND(CAST(COUNT(u.id) AS REAL) / COUNT(DISTINCT c.id), 1) AS avg_users_per_company FROM companies c LEFT JOIN users u ON c.id = u.company_id WHERE c.churned_at IS NULL GROUP BY c.plan;`,
    },
    {
      title: '최근 30일 미로그인 유저',
      track: 'case', domain: 'saas', dataset_id: datasetMap['saas'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['where', 'date', 'join'],
      description: `users 중 last_login이 '2024-03-01' 이전이거나 NULL인 유저의 이름(name), 이메일(email), 기업명(company name)을 조회하세요.`,
      solution_sql: `SELECT u.name, u.email, c.name AS company_name FROM users u JOIN companies c ON u.company_id = c.id WHERE u.last_login < '2024-03-01' OR u.last_login IS NULL;`,
    },
    {
      title: '플랜 업그레이드 이력 조회',
      track: 'case', domain: 'saas', dataset_id: datasetMap['saas'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['join', 'subquery', 'window'],
      description: `구독 이력이 2건 이상인 기업(업그레이드 경험 있음)의 기업명(company name)과 구독 횟수(sub_cnt)를 조회하세요.`,
      solution_sql: `SELECT c.name, COUNT(s.id) AS sub_cnt FROM subscriptions s JOIN companies c ON s.company_id = c.id GROUP BY c.id, c.name HAVING COUNT(s.id) >= 2;`,
    },

    // ── TRACK B: 핀테크 ─────────────────────────────────────────────────────
    {
      title: '카테고리별 지출 분석',
      track: 'case', domain: 'fintech', dataset_id: datasetMap['fintech'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['group_by', 'where', 'sum'],
      description: `transactions 테이블에서 type이 'payment'인 거래의 category별 총 지출(total_spent)과 건수(txn_cnt)를 조회하세요.\n- total_spent 내림차순 정렬`,
      solution_sql: `SELECT category, SUM(amount) AS total_spent, COUNT(*) AS txn_cnt FROM transactions WHERE type = 'payment' AND status = 'completed' GROUP BY category ORDER BY total_spent DESC;`,
    },
    {
      title: '잔액 상위 5개 계좌',
      track: 'case', domain: 'fintech', dataset_id: datasetMap['fintech'],
      chapter_id: null, difficulty: 'easy', grading_mode: 'ordered',
      tags: ['order_by', 'limit', 'join'],
      description: `accounts 테이블에서 balance 기준 상위 5개 계좌의 account id, 계좌 유형(type), 잔액(balance), 유저 이름(name)을 조회하세요.`,
      solution_sql: `SELECT a.id, a.type, a.balance, u.name FROM accounts a JOIN users u ON a.user_id = u.id WHERE a.status = 'active' ORDER BY a.balance DESC LIMIT 5;`,
    },
    {
      title: '유저별 월 지출 합계',
      track: 'case', domain: 'fintech', dataset_id: datasetMap['fintech'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'date'],
      description: `2024년 3월 한 달간 유저별 총 지출(total_payment)을 구하세요.\n- transactions.type = 'payment', status = 'completed'\n- accounts와 users를 조인하여 유저 이름(name)도 함께 출력하세요.`,
      solution_sql: `SELECT u.name, SUM(t.amount) AS total_payment FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN users u ON a.user_id = u.id WHERE t.type = 'payment' AND t.status = 'completed' AND t.created_at LIKE '2024-03-%' GROUP BY u.id, u.name ORDER BY total_payment DESC;`,
    },
    {
      title: '입금 vs 지출 비율',
      track: 'case', domain: 'fintech', dataset_id: datasetMap['fintech'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['case', 'sum', 'arithmetic'],
      description: `전체 거래(status = 'completed')를 기준으로 총 입금액(total_income), 총 지출액(total_payment), 순자산 변화(net_flow)를 조회하세요.`,
      solution_sql: `SELECT SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) AS total_income, SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END) AS total_payment, SUM(CASE WHEN type = 'deposit' THEN amount WHEN type = 'payment' THEN -amount ELSE 0 END) AS net_flow FROM transactions WHERE status = 'completed';`,
    },

    // ── TRACK B: 물류 ───────────────────────────────────────────────────────
    {
      title: '재고 부족 창고-상품 목록',
      track: 'case', domain: 'logistics', dataset_id: datasetMap['logistics'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['join', 'where'],
      description: `재고량(quantity)이 재주문 기준(reorder_point) 이하인 창고-상품 목록을 조회하세요.\n- 창고명(warehouse name), 상품명(product name), 재고량(quantity), 재주문 기준(reorder_point) 출력`,
      solution_sql: `SELECT w.name AS warehouse_name, p.name AS product_name, i.quantity, i.reorder_point FROM inventory i JOIN warehouses w ON i.warehouse_id = w.id JOIN products p ON i.product_id = p.id WHERE i.quantity <= i.reorder_point ORDER BY i.quantity ASC;`,
    },
    {
      title: '배송사별 배송 건수 및 지연율',
      track: 'case', domain: 'logistics', dataset_id: datasetMap['logistics'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['group_by', 'case', 'arithmetic'],
      description: `shipments 테이블에서 carrier별 총 배송 건수(total_cnt), 지연 건수(delayed_cnt), 지연율(delay_rate_pct)을 조회하세요.\n- status = 'delayed'인 것이 지연\n- delay_rate_pct = ROUND(delayed_cnt * 100.0 / total_cnt, 1)`,
      solution_sql: `SELECT carrier, COUNT(*) AS total_cnt, SUM(CASE WHEN status = 'delayed' THEN 1 ELSE 0 END) AS delayed_cnt, ROUND(SUM(CASE WHEN status = 'delayed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS delay_rate_pct FROM shipments GROUP BY carrier ORDER BY delay_rate_pct DESC;`,
    },
    {
      title: '가장 많이 출하된 상품 TOP 5',
      track: 'case', domain: 'logistics', dataset_id: datasetMap['logistics'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'ordered',
      tags: ['join', 'group_by', 'order_by'],
      description: `shipment_items와 products를 조인하여 상품별 총 출하 수량(total_shipped)을 구하고 TOP 5를 조회하세요.`,
      solution_sql: `SELECT p.name, SUM(si.quantity) AS total_shipped FROM shipment_items si JOIN products p ON si.product_id = p.id GROUP BY p.id, p.name ORDER BY total_shipped DESC LIMIT 5;`,
    },
    {
      title: '창고별 총 재고 가치 계산',
      track: 'case', domain: 'logistics', dataset_id: datasetMap['logistics'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'arithmetic'],
      description: `창고별 총 재고 가치(total_inventory_value)를 계산하세요.\n- 재고 가치 = quantity × unit_cost\n- 창고명(warehouse name), total_inventory_value 출력\n- 내림차순 정렬`,
      solution_sql: `SELECT w.name AS warehouse_name, SUM(i.quantity * p.unit_cost) AS total_inventory_value FROM inventory i JOIN warehouses w ON i.warehouse_id = w.id JOIN products p ON i.product_id = p.id GROUP BY w.id, w.name ORDER BY total_inventory_value DESC;`,
    },

    // ── TRACK B: 미디어 ─────────────────────────────────────────────────────
    {
      title: '카테고리별 평균 조회수',
      track: 'case', domain: 'media', dataset_id: datasetMap['media'],
      chapter_id: null, difficulty: 'easy', grading_mode: 'unordered',
      tags: ['group_by', 'avg'],
      description: `videos 테이블에서 category별 평균 조회수(avg_view_cnt)를 구하세요.\n- avg_view_cnt는 정수로 반올림\n- 내림차순 정렬`,
      solution_sql: `SELECT category, ROUND(AVG(view_cnt), 0) AS avg_view_cnt FROM videos WHERE status = 'published' GROUP BY category ORDER BY avg_view_cnt DESC;`,
    },
    {
      title: '크리에이터별 총 조회수 및 영상 수',
      track: 'case', domain: 'media', dataset_id: datasetMap['media'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'sum'],
      description: `크리에이터별로 이름(name), 채널(channel), 총 조회수(total_views), 업로드 영상 수(video_cnt)를 조회하세요.`,
      solution_sql: `SELECT c.name, c.channel, SUM(v.view_cnt) AS total_views, COUNT(v.id) AS video_cnt FROM creators c JOIN videos v ON c.id = v.creator_id GROUP BY c.id, c.name, c.channel ORDER BY total_views DESC;`,
    },
    {
      title: '댓글 많이 달린 영상 TOP 5',
      track: 'case', domain: 'media', dataset_id: datasetMap['media'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'ordered',
      tags: ['join', 'group_by', 'order_by'],
      description: `영상별 댓글 수(comment_cnt)를 구하고 상위 5개 영상의 제목(title)과 comment_cnt를 조회하세요.`,
      solution_sql: `SELECT v.title, COUNT(c.id) AS comment_cnt FROM videos v JOIN comments c ON v.id = c.video_id GROUP BY v.id, v.title ORDER BY comment_cnt DESC LIMIT 5;`,
    },
    {
      title: '구독자 대비 평균 조회수 효율',
      track: 'case', domain: 'media', dataset_id: datasetMap['media'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'arithmetic'],
      description: `크리에이터별 구독자 수(subscriber_cnt) 대비 평균 조회수 비율(view_per_sub)을 계산하세요.\n- view_per_sub = ROUND(total_views * 1.0 / subscriber_cnt, 2)\n- 내림차순 정렬`,
      solution_sql: `SELECT c.name, c.subscriber_cnt, SUM(v.view_cnt) AS total_views, ROUND(SUM(v.view_cnt) * 1.0 / c.subscriber_cnt, 2) AS view_per_sub FROM creators c JOIN videos v ON c.id = v.creator_id GROUP BY c.id, c.name, c.subscriber_cnt ORDER BY view_per_sub DESC;`,
    },

    // ── TRACK B: HR ────────────────────────────────────────────────────────
    {
      title: '부서별 평균 연봉',
      track: 'case', domain: 'hr', dataset_id: datasetMap['hr'],
      chapter_id: null, difficulty: 'easy', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'avg'],
      description: `부서별 평균 연봉(avg_salary)을 구하세요.\n- 부서명(department name), avg_salary 출력\n- avg_salary 내림차순 정렬`,
      solution_sql: `SELECT d.name, ROUND(AVG(e.salary), 0) AS avg_salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.status = 'active' GROUP BY d.id, d.name ORDER BY avg_salary DESC;`,
    },
    {
      title: '팀별 성과 등급 분포',
      track: 'case', domain: 'hr', dataset_id: datasetMap['hr'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'case'],
      description: `2023H2 성과 리뷰 기준 부서별 등급(S/A/B/C) 분포를 조회하세요.\n- 부서명(name), grade, 해당 등급 인원 수(cnt) 출력`,
      solution_sql: `SELECT d.name, pr.grade, COUNT(*) AS cnt FROM performance_reviews pr JOIN employees e ON pr.employee_id = e.id JOIN departments d ON e.department_id = d.id WHERE pr.period = '2023H2' GROUP BY d.id, d.name, pr.grade ORDER BY d.name, pr.grade;`,
    },
    {
      title: '연차 사용 현황',
      track: 'case', domain: 'hr', dataset_id: datasetMap['hr'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'where'],
      description: `직원별 승인된 연차(type='연차', status='approved') 총 사용 일수(total_leave_days)를 조회하세요.\n- 이름(name), total_leave_days 출력\n- 많이 사용한 순 정렬`,
      solution_sql: `SELECT e.name, SUM(l.days) AS total_leave_days FROM leaves l JOIN employees e ON l.employee_id = e.id WHERE l.type = '연차' AND l.status = 'approved' GROUP BY e.id, e.name ORDER BY total_leave_days DESC;`,
    },
    {
      title: '지각 또는 결근 직원 현황',
      track: 'case', domain: 'hr', dataset_id: datasetMap['hr'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['join', 'where', 'group_by'],
      description: `2024-03-18 ~ 2024-03-20 기간에 지각(late) 또는 결근(absent)이 있는 직원의 이름(name)과 이상 기록 수(incident_cnt)를 조회하세요.`,
      solution_sql: `SELECT e.name, COUNT(*) AS incident_cnt FROM attendance a JOIN employees e ON a.employee_id = e.id WHERE a.work_date BETWEEN '2024-03-18' AND '2024-03-20' AND a.status IN ('late', 'absent') GROUP BY e.id, e.name ORDER BY incident_cnt DESC;`,
    },

    // ── TRACK B: 커뮤니티 ─────────────────────────────────────────────────
    {
      title: '태그별 게시글 수',
      track: 'case', domain: 'community', dataset_id: datasetMap['community'],
      chapter_id: null, difficulty: 'easy', grading_mode: 'unordered',
      tags: ['join', 'group_by', 'count'],
      description: `태그별 게시글 수(post_cnt)를 조회하세요.\n- tags, post_tags를 조인하세요.\n- post_cnt 내림차순 정렬`,
      solution_sql: `SELECT t.name, COUNT(pt.post_id) AS post_cnt FROM tags t JOIN post_tags pt ON t.id = pt.tag_id GROUP BY t.id, t.name ORDER BY post_cnt DESC;`,
    },
    {
      title: '채택 답변이 있는 게시글 비율',
      track: 'case', domain: 'community', dataset_id: datasetMap['community'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'unordered',
      tags: ['subquery', 'case', 'arithmetic'],
      description: `category가 'Q&A'인 게시글 중, 채택 댓글(is_accepted = 1)이 있는 게시글 비율(solved_rate_pct)을 조회하세요.\n- solved_rate_pct = ROUND(solved_cnt * 100.0 / total_cnt, 1)`,
      solution_sql: `SELECT COUNT(*) AS total_cnt, SUM(CASE WHEN EXISTS (SELECT 1 FROM comments c WHERE c.post_id = p.id AND c.is_accepted = 1) THEN 1 ELSE 0 END) AS solved_cnt, ROUND(SUM(CASE WHEN EXISTS (SELECT 1 FROM comments c WHERE c.post_id = p.id AND c.is_accepted = 1) THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS solved_rate_pct FROM posts p WHERE p.category = 'Q&A';`,
    },
    {
      title: '가장 많이 팔로우된 유저 TOP 5',
      track: 'case', domain: 'community', dataset_id: datasetMap['community'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'ordered',
      tags: ['join', 'group_by', 'order_by'],
      description: `팔로워 수가 가장 많은 유저 5명의 username과 follower_cnt를 조회하세요.`,
      solution_sql: `SELECT u.username, COUNT(f.follower_id) AS follower_cnt FROM users u JOIN follows f ON u.id = f.following_id GROUP BY u.id, u.username ORDER BY follower_cnt DESC LIMIT 5;`,
    },
    {
      title: '최근 30일 활성 유저 vs 비활성 유저',
      track: 'case', domain: 'community', dataset_id: datasetMap['community'],
      chapter_id: null, difficulty: 'medium', grading_mode: 'unordered',
      tags: ['case', 'sum', 'date'],
      description: `last_active 기준으로 '2024-03-01' 이후 활성(active)과 그 이전 비활성(inactive) 유저 수를 조회하세요.\n- status, user_cnt 형식으로 출력`,
      solution_sql: `SELECT CASE WHEN last_active >= '2024-03-01' THEN 'active' ELSE 'inactive' END AS status, COUNT(*) AS user_cnt FROM users GROUP BY status;`,
    },
    {
      title: '게시글 조회수 기반 랭킹',
      track: 'case', domain: 'community', dataset_id: datasetMap['community'],
      chapter_id: null, difficulty: 'hard', grading_mode: 'ordered',
      tags: ['window', 'rank', 'join'],
      description: `카테고리별로 게시글을 조회수(view_cnt) 기준 내림차순 순위(rank)를 매기세요.\n- username, title, category, view_cnt, rank 출력\n- rank가 1인 게시글만 조회하세요.`,
      solution_sql: `WITH ranked AS (SELECT u.username, p.title, p.category, p.view_cnt, RANK() OVER (PARTITION BY p.category ORDER BY p.view_cnt DESC) AS rnk FROM posts p JOIN users u ON p.user_id = u.id) SELECT username, title, category, view_cnt, rnk FROM ranked WHERE rnk = 1;`,
    },
  ]
}

// ── 실행 ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 시드 시작...\n')

  // 1. 챕터 삽입
  console.log('📚 챕터 삽입 중...')
  const { data: chapterRows, error: chErr } = await sb
    .from('chapters')
    .upsert(CHAPTERS, { onConflict: 'order_num' })
    .select('id, order_num')
  if (chErr) { console.error('챕터 오류:', chErr); process.exit(1) }
  const chapterMap: Record<number, string> = {}
  for (const ch of chapterRows ?? []) chapterMap[ch.order_num] = ch.id
  console.log(`  ✓ ${Object.keys(chapterMap).length}개 챕터`)

  // 2. 데이터셋 삽입
  console.log('🗄️  데이터셋 삽입 중...')
  const datasetMap: Record<string, string> = {}
  for (const ds of DATASETS) {
    const setup_sql = readSql(ds.file)
    const { data: existing } = await sb.from('datasets').select('id').eq('title', ds.title).maybeSingle()
    if (existing) {
      datasetMap[ds.domain] = existing.id
      console.log(`  ↩ ${ds.domain} (기존)`)
      continue
    }
    const { data, error } = await sb
      .from('datasets')
      .insert({ domain: ds.domain, title: ds.title, description: ds.description, setup_sql })
      .select('id, domain')
      .single()
    if (error) { console.error(`데이터셋 오류 [${ds.domain}]:`, error); continue }
    datasetMap[ds.domain] = data.id
    console.log(`  ✓ ${ds.domain}`)
  }

  // 3. 문제 삽입
  console.log('📝 문제 삽입 중...')
  const problems = buildProblems(chapterMap, datasetMap)
  let inserted = 0
  for (const p of problems) {
    const { solution_sql, ...problemData } = p
    const { data: prob, error: pErr } = await sb
      .from('problems')
      .insert({ ...problemData, tags: problemData.tags })
      .select('id')
      .single()
    if (pErr) { console.error(`문제 오류 [${p.title}]:`, pErr.message); continue }
    if (solution_sql) {
      await sb.from('problem_solutions').insert({ problem_id: prob.id, solution_sql })
    }
    inserted++
  }
  console.log(`  ✓ ${inserted}개 문제`)

  // 4. 추가 문제 삽입
  console.log('📝 추가 문제 삽입 중...')
  let extraInserted = 0
  for (const p of EXTRA_PROBLEMS) {
    const dataset_id = datasetMap[p.dataset_domain]
    const chapter_id = p.chapter_num ? chapterMap[p.chapter_num] : null
    if (!dataset_id) { console.error(`  ✗ 데이터셋 없음: ${p.dataset_domain} [${p.title}]`); continue }
    const { solution_sql, dataset_domain, chapter_num, ...rest } = p
    const { data: prob, error: pErr } = await sb
      .from('problems')
      .insert({ ...rest, dataset_id, chapter_id })
      .select('id')
      .single()
    if (pErr) { console.error(`  ✗ 추가 문제 오류 [${p.title}]:`, pErr.message); continue }
    if (solution_sql) {
      await sb.from('problem_solutions').insert({ problem_id: prob.id, solution_sql })
    }
    extraInserted++
  }
  console.log(`  ✓ ${extraInserted}개 추가 문제`)

  // 5. 추가 문제 2 삽입
  console.log('📝 추가 문제 2 삽입 중...')
  let extra2Inserted = 0
  for (const p of EXTRA_PROBLEMS2) {
    const dataset_id = datasetMap[p.dataset_domain]
    const chapter_id = p.chapter_num ? chapterMap[p.chapter_num] : null
    if (!dataset_id) { console.error(`  ✗ 데이터셋 없음: ${p.dataset_domain} [${p.title}]`); continue }
    const { solution_sql, dataset_domain, chapter_num, ...rest } = p
    const { data: prob, error: pErr } = await sb
      .from('problems')
      .insert({ ...rest, dataset_id, chapter_id })
      .select('id')
      .single()
    if (pErr) { console.error(`  ✗ 추가 문제2 오류 [${p.title}]:`, pErr.message); continue }
    if (solution_sql) {
      await sb.from('problem_solutions').insert({ problem_id: prob.id, solution_sql })
    }
    extra2Inserted++
  }
  console.log(`  ✓ ${extra2Inserted}개 추가 문제 2`)

  console.log('\n✅ 시드 완료!')
}

main()
