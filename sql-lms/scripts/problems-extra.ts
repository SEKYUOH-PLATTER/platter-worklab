/**
 * 추가 문제 데이터
 * dataset_domain: datasets.domain 값
 * chapter_num: chapters.order_num 값 (1~10), 케이스 문제는 null
 */
export interface ProblemSpec {
  title: string
  track: 'syntax' | 'case'
  domain: string | null
  dataset_domain: string
  chapter_num: number | null
  difficulty: 'easy' | 'medium' | 'hard'
  grading_mode: 'ordered' | 'unordered'
  tags: string[]
  description: string
  solution_sql: string
}

export const EXTRA_PROBLEMS: ProblemSpec[] = [

  // ── TRACK A: 문법 실습 추가 ─────────────────────────────────────────────────

  // Ch1 — SELECT 심화
  {
    title: '할인가 계산',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 1,
    difficulty: 'easy', grading_mode: 'ordered', tags: ['select', 'arithmetic'],
    description: `products 테이블에서 name, price와 함께 10% 할인가(discounted_price)를 계산하여 조회하세요.\n- discounted_price = ROUND(price * 0.9, 0)\n- price 내림차순 정렬`,
    solution_sql: `SELECT name, price, ROUND(price * 0.9, 0) AS discounted_price FROM products ORDER BY price DESC;`,
  },
  {
    title: '상품명 검색 (LIKE)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 1,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['select', 'like'],
    description: `products 테이블에서 name에 '이어폰' 또는 '스피커'가 포함된 상품의 name과 price를 조회하세요.`,
    solution_sql: `SELECT name, price FROM products WHERE name LIKE '%이어폰%' OR name LIKE '%스피커%';`,
  },

  // Ch2 — WHERE 심화
  {
    title: '이름 패턴 검색',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 2,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['where', 'like'],
    description: `customers 테이블에서 name이 '이'로 시작하는 고객의 모든 정보를 조회하세요.`,
    solution_sql: `SELECT * FROM customers WHERE name LIKE '이%';`,
  },
  {
    title: '복합 조건 필터 (AND/OR)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 2,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['where', 'and', 'or'],
    description: `customers 테이블에서 city가 '서울'이면서 grade가 'vip' 또는 'platinum'인 고객의 name, city, grade를 조회하세요.`,
    solution_sql: `SELECT name, city, grade FROM customers WHERE city = '서울' AND grade IN ('vip', 'platinum');`,
  },
  {
    title: '2023년 이후 가입 고객',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 2,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['where', 'date'],
    description: `customers 테이블에서 joined_at이 '2023-01-01' 이후인 고객의 name과 joined_at을 조회하세요.`,
    solution_sql: `SELECT name, joined_at FROM customers WHERE joined_at >= '2023-01-01';`,
  },

  // Ch3 — ORDER BY 심화
  {
    title: '상위 5개 비싼 상품',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 3,
    difficulty: 'easy', grading_mode: 'ordered', tags: ['order_by', 'limit'],
    description: `products 테이블에서 price 기준 내림차순으로 상위 5개 상품의 name과 price를 조회하세요.`,
    solution_sql: `SELECT name, price FROM products ORDER BY price DESC LIMIT 5;`,
  },
  {
    title: '6위~10위 상품 조회 (OFFSET)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 3,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['order_by', 'limit', 'offset'],
    description: `products 테이블에서 price 내림차순 기준 6위~10위 상품의 name과 price를 조회하세요.\n(LIMIT + OFFSET 사용)`,
    solution_sql: `SELECT name, price FROM products ORDER BY price DESC LIMIT 5 OFFSET 5;`,
  },

  // Ch4 — 집계함수 심화
  {
    title: '실제 구매자 수 (DISTINCT)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 4,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['count', 'distinct'],
    description: `orders 테이블에서 완료(completed) 주문을 한 고유 고객 수(unique_buyers)를 조회하세요.`,
    solution_sql: `SELECT COUNT(DISTINCT customer_id) AS unique_buyers FROM orders WHERE status = 'completed';`,
  },
  {
    title: '전체 재고 총량',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 4,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['sum'],
    description: `products 테이블에서 카테고리별 총 재고량(total_stock)을 조회하세요.`,
    solution_sql: `SELECT category, SUM(stock) AS total_stock FROM products GROUP BY category ORDER BY total_stock DESC;`,
  },

  // Ch5 — GROUP BY 심화
  {
    title: '상태별 주문 현황 분석',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 5,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['group_by', 'count', 'sum'],
    description: `orders 테이블에서 status별 주문 건수(cnt)와 총 금액(total_revenue)을 조회하세요.\n- cnt 내림차순 정렬`,
    solution_sql: `SELECT status, COUNT(*) AS cnt, SUM(total_price) AS total_revenue FROM orders GROUP BY status ORDER BY cnt DESC;`,
  },
  {
    title: '도시·등급별 고객 분포',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 5,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['group_by'],
    description: `customers 테이블에서 city와 grade를 함께 그룹화하여 각 조합의 고객 수(cnt)를 조회하세요.\n- city 오름차순, cnt 내림차순 정렬`,
    solution_sql: `SELECT city, grade, COUNT(*) AS cnt FROM customers GROUP BY city, grade ORDER BY city ASC, cnt DESC;`,
  },

  // Ch6 — JOIN 심화
  {
    title: '3테이블 조인 — 고객·주문·상품',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 6,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join'],
    description: `customers, orders, products를 모두 조인하여 고객 이름(customer_name), 상품명(product_name), 수량(quantity), 결제 금액(total_price)을 조회하세요.\n- completed 주문만`,
    solution_sql: `SELECT c.name AS customer_name, p.name AS product_name, o.quantity, o.total_price FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE o.status = 'completed';`,
  },
  {
    title: '고객별 총 구매액 (LEFT JOIN)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 6,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['left_join', 'coalesce'],
    description: `모든 고객의 이름(name)과 총 구매액(total_spent)을 조회하세요.\n- 구매 이력이 없는 고객은 0으로 표시\n- total_spent 내림차순 정렬`,
    solution_sql: `SELECT c.name, COALESCE(SUM(o.total_price), 0) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY total_spent DESC;`,
  },

  // Ch7 — 서브쿼리 심화
  {
    title: '전자기기 구매 고객 목록',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 7,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['subquery', 'in', 'join'],
    description: `'전자기기' 카테고리 상품을 구매한 적 있는 고객의 name을 중복 없이 조회하세요.\n(IN + 서브쿼리 사용)`,
    solution_sql: `SELECT DISTINCT c.name FROM customers c WHERE c.id IN (SELECT o.customer_id FROM orders o JOIN products p ON o.product_id = p.id WHERE p.category = '전자기기');`,
  },
  {
    title: '카테고리 평균가와 함께 조회',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 7,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['subquery', 'correlated'],
    description: `products 테이블에서 name, price와 함께 해당 상품이 속한 카테고리의 평균 가격(category_avg)을 조회하세요.\n- 스칼라 서브쿼리 사용\n- category_avg는 ROUND(..., 0)`,
    solution_sql: `SELECT name, price, (SELECT ROUND(AVG(p2.price), 0) FROM products p2 WHERE p2.category = products.category) AS category_avg FROM products;`,
  },

  // Ch8 — CASE 심화
  {
    title: '주문 상태별 피벗 집계',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 8,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['case', 'sum'],
    description: `orders 테이블에서 status별 건수를 가로로 펼쳐 조회하세요.\n- 컬럼: completed_cnt, cancelled_cnt, pending_cnt`,
    solution_sql: `SELECT SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_cnt, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_cnt, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_cnt FROM orders;`,
  },
  {
    title: '재고 상태 분류',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 8,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['case'],
    description: `products 테이블에서 name, stock과 함께 재고 상태(stock_status)를 분류하여 조회하세요.\n- stock = 0: '품절'\n- stock < 100: '부족'\n- 그 외: '충분'`,
    solution_sql: `SELECT name, stock, CASE WHEN stock = 0 THEN '품절' WHEN stock < 100 THEN '부족' ELSE '충분' END AS stock_status FROM products ORDER BY stock ASC;`,
  },

  // Ch9 — 윈도우함수 심화
  {
    title: '이전 주문 날짜 비교 (LAG)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 9,
    difficulty: 'hard', grading_mode: 'ordered', tags: ['window', 'lag'],
    description: `orders 테이블에서 customer_id별로 ordered_at 순으로 정렬하여 직전 주문일(prev_order_date)을 함께 조회하세요.\n- 컬럼: customer_id, ordered_at, prev_order_date`,
    solution_sql: `SELECT customer_id, ordered_at, LAG(ordered_at) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS prev_order_date FROM orders ORDER BY customer_id, ordered_at;`,
  },
  {
    title: '가격 사분위 분류 (NTILE)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 9,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['window', 'ntile'],
    description: `products 테이블에서 price 기준으로 상품을 4개 구간(quartile 1~4)으로 나눠 name, price, quartile을 조회하세요.`,
    solution_sql: `SELECT name, price, NTILE(4) OVER (ORDER BY price) AS quartile FROM products;`,
  },
  {
    title: '파티션별 누적 매출',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 9,
    difficulty: 'hard', grading_mode: 'ordered', tags: ['window', 'sum', 'partition'],
    description: `orders 테이블(completed만)에서 ordered_at 순으로 정렬 후 customer_id별 누적 구매액(cumulative_spent)을 조회하세요.\n- 컬럼: customer_id, ordered_at, total_price, cumulative_spent`,
    solution_sql: `SELECT customer_id, ordered_at, total_price, SUM(total_price) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS cumulative_spent FROM orders WHERE status = 'completed' ORDER BY customer_id, ordered_at;`,
  },

  // Ch10 — NULL 심화
  {
    title: '0 나누기 방어 (NULLIF)',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 10,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['null', 'nullif'],
    description: `products 테이블에서 name, price, stock과 함께 단위당 가격(price_per_unit = ROUND(CAST(price AS REAL) / NULLIF(stock, 0), 2))을 조회하세요.\n- stock이 0인 상품은 price_per_unit이 NULL로 표시되어야 합니다.`,
    solution_sql: `SELECT name, price, stock, ROUND(CAST(price AS REAL) / NULLIF(stock, 0), 2) AS price_per_unit FROM products;`,
  },
  {
    title: '구매 이력 없는 고객 0으로 표시',
    track: 'syntax', domain: null, dataset_domain: 'syntax_common', chapter_num: 10,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['null', 'coalesce', 'left_join'],
    description: `모든 고객의 이름(name)과 완료된 주문 건수(completed_orders)를 조회하세요.\n- 구매 이력 없는 고객은 0으로 표시\n- COALESCE와 LEFT JOIN 활용`,
    solution_sql: `SELECT c.name, COALESCE(COUNT(o.id), 0) AS completed_orders FROM customers c LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed' GROUP BY c.id, c.name ORDER BY completed_orders DESC;`,
  },

  // ── TRACK B: 이커머스 추가 ──────────────────────────────────────────────────
  {
    title: '고객별 첫 구매 날짜',
    track: 'case', domain: 'ecommerce', dataset_domain: 'ecommerce', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['group_by', 'min', 'join'],
    description: `각 고객의 이름(name)과 최초 구매일(first_order_date)을 조회하세요.\n- 완료된 주문(completed)만 대상\n- first_order_date 오름차순 정렬`,
    solution_sql: `SELECT u.name, MIN(o.created_at) AS first_order_date FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'completed' GROUP BY u.id, u.name ORDER BY first_order_date;`,
  },
  {
    title: '상품별 누적 판매량 랭킹',
    track: 'case', domain: 'ecommerce', dataset_domain: 'ecommerce', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['join', 'group_by', 'order_by'],
    description: `상품별 총 판매 수량(total_qty)을 집계하고 많이 팔린 순으로 순위(rank)를 매겨 조회하세요.\n- order_items 활용\n- 컬럼: name, total_qty, rank`,
    solution_sql: `WITH sales AS (SELECT p.name, SUM(oi.quantity) AS total_qty FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.id, p.name) SELECT name, total_qty, RANK() OVER (ORDER BY total_qty DESC) AS rank FROM sales;`,
  },
  {
    title: '리뷰 작성률 분석',
    track: 'case', domain: 'ecommerce', dataset_domain: 'ecommerce', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['join', 'group_by', 'arithmetic'],
    description: `상품별로 총 주문 건수(order_cnt)와 리뷰 수(review_cnt), 리뷰 작성률(review_rate_pct)을 조회하세요.\n- review_rate_pct = ROUND(review_cnt * 100.0 / order_cnt, 1)\n- order_cnt >= 1인 상품만 포함`,
    solution_sql: `SELECT p.name, COUNT(DISTINCT oi.order_id) AS order_cnt, COUNT(DISTINCT r.id) AS review_cnt, ROUND(COUNT(DISTINCT r.id) * 100.0 / COUNT(DISTINCT oi.order_id), 1) AS review_rate_pct FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id LEFT JOIN reviews r ON p.id = r.product_id GROUP BY p.id, p.name HAVING COUNT(DISTINCT oi.order_id) >= 1 ORDER BY review_rate_pct DESC;`,
  },
  {
    title: '월별 신규 고객 수',
    track: 'case', domain: 'ecommerce', dataset_domain: 'ecommerce', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['group_by', 'date'],
    description: `연도-월별 신규 가입 고객 수(new_users)를 조회하세요.\n- created_at 기준 그룹화\n- 최신 월 순 정렬`,
    solution_sql: `SELECT STRFTIME('%Y-%m', created_at) AS month, COUNT(*) AS new_users FROM users GROUP BY month ORDER BY month DESC;`,
  },
  {
    title: '환불/취소 비율이 높은 상품',
    track: 'case', domain: 'ecommerce', dataset_domain: 'ecommerce', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['join', 'group_by', 'case'],
    description: `상품별 총 주문 건수(total_orders)와 취소·환불 건수(cancelled_cnt), 취소율(cancel_rate_pct)을 구하세요.\n- cancel_rate_pct = ROUND(cancelled_cnt * 100.0 / total_orders, 1)\n- total_orders >= 1인 상품만, cancel_rate_pct 내림차순 정렬`,
    solution_sql: `SELECT p.name, COUNT(DISTINCT oi.order_id) AS total_orders, COUNT(DISTINCT CASE WHEN o.status IN ('cancelled', 'refunded') THEN oi.order_id END) AS cancelled_cnt, ROUND(COUNT(DISTINCT CASE WHEN o.status IN ('cancelled', 'refunded') THEN oi.order_id END) * 100.0 / COUNT(DISTINCT oi.order_id), 1) AS cancel_rate_pct FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id GROUP BY p.id, p.name HAVING COUNT(DISTINCT oi.order_id) >= 1 ORDER BY cancel_rate_pct DESC;`,
  },
  {
    title: '등급별 고객 LTV 분석',
    track: 'case', domain: 'ecommerce', dataset_domain: 'ecommerce', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['join', 'group_by', 'avg'],
    description: `고객 등급(grade)별 평균 LTV(avg_ltv = 1인당 평균 총 구매액)를 분석하세요.\n- completed 주문만\n- 컬럼: grade, customer_cnt, avg_ltv`,
    solution_sql: `WITH user_spend AS (SELECT u.grade, u.id, SUM(o.total_amount) AS ltv FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = 'completed' GROUP BY u.id, u.grade) SELECT grade, COUNT(*) AS customer_cnt, ROUND(AVG(ltv), 0) AS avg_ltv FROM user_spend GROUP BY grade ORDER BY avg_ltv DESC;`,
  },

  // ── TRACK B: SaaS 추가 ─────────────────────────────────────────────────────
  {
    title: '월별 신규 기업 등록 수',
    track: 'case', domain: 'saas', dataset_domain: 'saas', chapter_num: null,
    difficulty: 'easy', grading_mode: 'ordered', tags: ['group_by', 'date'],
    description: `companies 테이블에서 연도-월별 신규 등록 기업 수(new_companies)를 조회하세요.\n- created_at 기준, 최신 월 순 정렬`,
    solution_sql: `SELECT STRFTIME('%Y-%m', created_at) AS month, COUNT(*) AS new_companies FROM companies GROUP BY month ORDER BY month DESC;`,
  },
  {
    title: '가장 많이 쓰인 기능 TOP 5',
    track: 'case', domain: 'saas', dataset_domain: 'saas', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['group_by', 'order_by'],
    description: `events 테이블에서 event_name이 'feature_use'인 이벤트를 기준으로 page별 사용 횟수(use_cnt)를 집계하여 상위 5개를 조회하세요.`,
    solution_sql: `SELECT page, COUNT(*) AS use_cnt FROM events WHERE event_name = 'feature_use' GROUP BY page ORDER BY use_cnt DESC LIMIT 5;`,
  },
  {
    title: '기업당 평균 이벤트 수 (활성도)',
    track: 'case', domain: 'saas', dataset_domain: 'saas', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['join', 'group_by', 'avg'],
    description: `플랜(plan)별로 기업당 평균 이벤트 수(avg_events_per_company)를 조회하세요.\n- churned 기업 제외\n- events → users → companies 조인`,
    solution_sql: `SELECT c.plan, ROUND(CAST(COUNT(e.id) AS REAL) / COUNT(DISTINCT c.id), 1) AS avg_events_per_company FROM companies c JOIN users u ON c.id = u.company_id LEFT JOIN events e ON u.id = e.user_id WHERE c.churned_at IS NULL GROUP BY c.plan ORDER BY avg_events_per_company DESC;`,
  },
  {
    title: '구독 기간별 기업 분포',
    track: 'case', domain: 'saas', dataset_domain: 'saas', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['case', 'group_by', 'date'],
    description: `각 기업의 구독 기간(started_at ~ 현재 또는 ended_at)을 기준으로 '1년 미만', '1~2년', '2년 이상' 구간별 기업 수를 조회하세요.\n- 가장 최근 구독 기록 기준\n- reference date: '2024-03-20'`,
    solution_sql: `WITH sub_age AS (SELECT company_id, MIN(started_at) AS earliest_start FROM subscriptions GROUP BY company_id) SELECT CASE WHEN CAST((JULIANDAY('2024-03-20') - JULIANDAY(earliest_start)) / 365 AS INTEGER) < 1 THEN '1년 미만' WHEN CAST((JULIANDAY('2024-03-20') - JULIANDAY(earliest_start)) / 365 AS INTEGER) < 2 THEN '1~2년' ELSE '2년 이상' END AS tenure_group, COUNT(*) AS company_cnt FROM sub_age GROUP BY tenure_group;`,
  },
  {
    title: '관리자 계정이 없는 기업 찾기',
    track: 'case', domain: 'saas', dataset_domain: 'saas', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'subquery', 'null'],
    description: `users 중 role = 'admin'인 유저가 없는 기업의 name과 plan을 조회하세요.`,
    solution_sql: `SELECT c.name, c.plan FROM companies c WHERE c.id NOT IN (SELECT DISTINCT u.company_id FROM users u WHERE u.role = 'admin') ORDER BY c.name;`,
  },

  // ── TRACK B: 핀테크 추가 ────────────────────────────────────────────────────
  {
    title: '월별 거래 총액 분석',
    track: 'case', domain: 'fintech', dataset_domain: 'fintech', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['group_by', 'date', 'sum'],
    description: `transactions 테이블에서 연도-월별 총 거래 금액(total_amount)과 거래 건수(txn_cnt)를 조회하세요.\n- status = 'completed'만\n- 최신 월 순 정렬`,
    solution_sql: `SELECT STRFTIME('%Y-%m', created_at) AS month, SUM(amount) AS total_amount, COUNT(*) AS txn_cnt FROM transactions WHERE status = 'completed' GROUP BY month ORDER BY month DESC;`,
  },
  {
    title: '단일 거래 금액 TOP 5',
    track: 'case', domain: 'fintech', dataset_domain: 'fintech', chapter_num: null,
    difficulty: 'easy', grading_mode: 'ordered', tags: ['order_by', 'limit', 'join'],
    description: `가장 큰 단일 거래 5건의 거래 ID(transaction id), 금액(amount), 유저 이름(name), 거래 유형(type)을 조회하세요.`,
    solution_sql: `SELECT t.id, t.amount, u.name, t.type FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN users u ON a.user_id = u.id WHERE t.status = 'completed' ORDER BY t.amount DESC LIMIT 5;`,
  },
  {
    title: '계좌 유형별 평균 잔액',
    track: 'case', domain: 'fintech', dataset_domain: 'fintech', chapter_num: null,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['group_by', 'avg'],
    description: `accounts 테이블에서 type별 평균 잔액(avg_balance)을 조회하세요.\n- status = 'active'인 계좌만\n- avg_balance 내림차순 정렬`,
    solution_sql: `SELECT type, ROUND(AVG(balance), 0) AS avg_balance FROM accounts WHERE status = 'active' GROUP BY type ORDER BY avg_balance DESC;`,
  },
  {
    title: '입금 많은 날 분석',
    track: 'case', domain: 'fintech', dataset_domain: 'fintech', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['group_by', 'date', 'where'],
    description: `type = 'deposit', status = 'completed'인 거래를 날짜(DATE(created_at))별로 집계하여 총 입금액(total_deposit) TOP 5 날짜를 조회하세요.`,
    solution_sql: `SELECT DATE(created_at) AS date, SUM(amount) AS total_deposit FROM transactions WHERE type = 'deposit' AND status = 'completed' GROUP BY date ORDER BY total_deposit DESC LIMIT 5;`,
  },

  // ── TRACK B: 물류 추가 ─────────────────────────────────────────────────────
  {
    title: '배송 완료율 분석',
    track: 'case', domain: 'logistics', dataset_domain: 'logistics', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['group_by', 'case', 'arithmetic'],
    description: `전체 shipments 중 status별 건수와 비율(rate_pct)을 조회하세요.\n- rate_pct = ROUND(cnt * 100.0 / total, 1)`,
    solution_sql: `SELECT status, COUNT(*) AS cnt, ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM shipments), 1) AS rate_pct FROM shipments GROUP BY status ORDER BY cnt DESC;`,
  },
  {
    title: '창고 용량 대비 재고 비율',
    track: 'case', domain: 'logistics', dataset_domain: 'logistics', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['join', 'group_by', 'arithmetic'],
    description: `창고별 총 재고 수량(total_qty)과 창고 용량(capacity) 대비 사용률(usage_pct)을 조회하세요.\n- usage_pct = ROUND(total_qty * 100.0 / capacity, 1)`,
    solution_sql: `SELECT w.name, w.capacity, SUM(i.quantity) AS total_qty, ROUND(SUM(i.quantity) * 100.0 / w.capacity, 1) AS usage_pct FROM warehouses w JOIN inventory i ON w.id = i.warehouse_id GROUP BY w.id, w.name, w.capacity ORDER BY usage_pct DESC;`,
  },
  {
    title: '카테고리별 총 출하량',
    track: 'case', domain: 'logistics', dataset_domain: 'logistics', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'group_by'],
    description: `완료된 배송(delivered)에서 상품 카테고리별 총 출하 수량(total_shipped)을 조회하세요.`,
    solution_sql: `SELECT p.category, SUM(si.quantity) AS total_shipped FROM shipment_items si JOIN products p ON si.product_id = p.id JOIN shipments s ON si.shipment_id = s.id WHERE s.status = 'delivered' GROUP BY p.category ORDER BY total_shipped DESC;`,
  },
  {
    title: '평균 배송 소요 일수',
    track: 'case', domain: 'logistics', dataset_domain: 'logistics', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'group_by', 'date'],
    description: `배송사(carrier)별 평균 배송 소요 일수(avg_days)를 계산하세요.\n- 완료(delivered)된 배송만\n- avg_days = ROUND(AVG(JULIANDAY(delivered_at) - JULIANDAY(shipped_at)), 1)`,
    solution_sql: `SELECT carrier, COUNT(*) AS delivery_cnt, ROUND(AVG(JULIANDAY(delivered_at) - JULIANDAY(shipped_at)), 1) AS avg_days FROM shipments WHERE status = 'delivered' GROUP BY carrier ORDER BY avg_days ASC;`,
  },
  {
    title: '재고 있는 창고 수가 가장 많은 상품',
    track: 'case', domain: 'logistics', dataset_domain: 'logistics', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['join', 'group_by'],
    description: `상품이 재고가 있는(quantity > 0) 창고 수(warehouse_cnt)를 기준으로 상위 5개 상품을 조회하세요.\n- 상품명(name), warehouse_cnt 출력`,
    solution_sql: `SELECT p.name, COUNT(i.warehouse_id) AS warehouse_cnt FROM inventory i JOIN products p ON i.product_id = p.id WHERE i.quantity > 0 GROUP BY p.id, p.name ORDER BY warehouse_cnt DESC LIMIT 5;`,
  },

  // ── TRACK B: 미디어 추가 ─────────────────────────────────────────────────
  {
    title: '영상 완주율 분석',
    track: 'case', domain: 'media', dataset_domain: 'media', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['join', 'group_by', 'arithmetic'],
    description: `영상별 평균 시청 완주율(completion_rate_pct)을 계산하세요.\n- completion_rate_pct = ROUND(AVG(v.watch_duration_sec * 100.0 / vid.duration_sec), 1)\n- 영상 제목(title), completion_rate_pct 출력\n- 내림차순 정렬`,
    solution_sql: `SELECT vid.title, ROUND(AVG(v.watch_duration_sec * 100.0 / vid.duration_sec), 1) AS completion_rate_pct FROM views v JOIN videos vid ON v.video_id = vid.id GROUP BY vid.id, vid.title ORDER BY completion_rate_pct DESC;`,
  },
  {
    title: '기기별 시청 분포',
    track: 'case', domain: 'media', dataset_domain: 'media', chapter_num: null,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['group_by', 'count'],
    description: `views 테이블에서 device별 시청 건수(view_cnt)와 비율(rate_pct)을 조회하세요.\n- rate_pct = ROUND(view_cnt * 100.0 / total, 1)`,
    solution_sql: `SELECT device, COUNT(*) AS view_cnt, ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM views), 1) AS rate_pct FROM views GROUP BY device ORDER BY view_cnt DESC;`,
  },
  {
    title: '가장 많은 구독자를 보유한 크리에이터',
    track: 'case', domain: 'media', dataset_domain: 'media', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['join', 'group_by', 'order_by'],
    description: `creator_subscriptions를 집계하여 실제 구독자 수(actual_subscribers)가 가장 많은 크리에이터 TOP 3를 조회하세요.\n- 크리에이터 이름(name), actual_subscribers 출력`,
    solution_sql: `SELECT c.name, COUNT(cs.viewer_id) AS actual_subscribers FROM creators c JOIN creator_subscriptions cs ON c.id = cs.creator_id GROUP BY c.id, c.name ORDER BY actual_subscribers DESC LIMIT 3;`,
  },
  {
    title: '인기 영상 상위 댓글 좋아요',
    track: 'case', domain: 'media', dataset_domain: 'media', chapter_num: null,
    difficulty: 'medium', grading_mode: 'ordered', tags: ['join', 'order_by'],
    description: `댓글 좋아요(like_cnt)가 가장 높은 댓글 10개의 영상 제목(video_title), 댓글 내용(content), like_cnt를 조회하세요.`,
    solution_sql: `SELECT v.title AS video_title, c.content, c.like_cnt FROM comments c JOIN videos v ON c.video_id = v.id ORDER BY c.like_cnt DESC LIMIT 10;`,
  },
  {
    title: '크리에이터별 평균 영상 길이',
    track: 'case', domain: 'media', dataset_domain: 'media', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'group_by', 'avg'],
    description: `크리에이터별 평균 영상 길이(avg_duration_min)를 분 단위로 조회하세요.\n- avg_duration_min = ROUND(AVG(duration_sec) / 60.0, 1)\n- 내림차순 정렬`,
    solution_sql: `SELECT c.name, ROUND(AVG(v.duration_sec) / 60.0, 1) AS avg_duration_min FROM creators c JOIN videos v ON c.id = v.creator_id GROUP BY c.id, c.name ORDER BY avg_duration_min DESC;`,
  },

  // ── TRACK B: HR 추가 ────────────────────────────────────────────────────────
  {
    title: '팀별 초과근무 현황',
    track: 'case', domain: 'hr', dataset_domain: 'hr', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'group_by', 'where'],
    description: `attendance에서 work_type = 'overtime' 또는 status = 'overtime'인 기록을 부서별로 집계하여 초과근무 건수(overtime_cnt)를 조회하세요.`,
    solution_sql: `SELECT d.name, COUNT(a.id) AS overtime_cnt FROM attendance a JOIN employees e ON a.employee_id = e.id JOIN departments d ON e.department_id = d.id WHERE a.status = 'overtime' GROUP BY d.id, d.name ORDER BY overtime_cnt DESC;`,
  },
  {
    title: '레벨별 연봉 분포',
    track: 'case', domain: 'hr', dataset_domain: 'hr', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['group_by', 'avg', 'min', 'max'],
    description: `직원 레벨(level)별 평균(avg_salary), 최저(min_salary), 최고(max_salary) 연봉을 조회하세요.\n- active 직원만`,
    solution_sql: `SELECT level, COUNT(*) AS cnt, ROUND(AVG(salary), 0) AS avg_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees WHERE status = 'active' GROUP BY level ORDER BY avg_salary DESC;`,
  },
  {
    title: '매니저별 팀원 수',
    track: 'case', domain: 'hr', dataset_domain: 'hr', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'group_by'],
    description: `각 매니저의 이름(manager_name)과 직접 보고하는 팀원 수(direct_reports)를 조회하세요.\n- manager_id가 있는 active 직원 기준\n- direct_reports 내림차순 정렬`,
    solution_sql: `SELECT m.name AS manager_name, COUNT(e.id) AS direct_reports FROM employees e JOIN employees m ON e.manager_id = m.id WHERE e.status = 'active' GROUP BY m.id, m.name ORDER BY direct_reports DESC;`,
  },
  {
    title: '성과 S등급 직원 목록',
    track: 'case', domain: 'hr', dataset_domain: 'hr', chapter_num: null,
    difficulty: 'easy', grading_mode: 'unordered', tags: ['join', 'where'],
    description: `2023H2 성과 리뷰에서 grade = 'S'를 받은 직원의 이름(name), 부서(department name), 연봉(salary)을 조회하세요.`,
    solution_sql: `SELECT e.name, d.name AS department, e.salary FROM performance_reviews pr JOIN employees e ON pr.employee_id = e.id JOIN departments d ON e.department_id = d.id WHERE pr.period = '2023H2' AND pr.grade = 'S' ORDER BY e.salary DESC;`,
  },
  {
    title: '평균 근속 연수 분석',
    track: 'case', domain: 'hr', dataset_domain: 'hr', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['group_by', 'date', 'arithmetic'],
    description: `부서별 평균 근속 연수(avg_tenure_years)를 계산하세요.\n- reference date: '2024-03-20'\n- avg_tenure_years = ROUND(AVG(JULIANDAY('2024-03-20') - JULIANDAY(hired_at)) / 365.0, 1)`,
    solution_sql: `SELECT d.name, ROUND(AVG(JULIANDAY('2024-03-20') - JULIANDAY(e.hired_at)) / 365.0, 1) AS avg_tenure_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.status = 'active' GROUP BY d.id, d.name ORDER BY avg_tenure_years DESC;`,
  },

  // ── TRACK B: 커뮤니티 추가 ──────────────────────────────────────────────────
  {
    title: '가장 활발한 기여자 TOP 5',
    track: 'case', domain: 'community', dataset_domain: 'community', chapter_num: null,
    difficulty: 'hard', grading_mode: 'ordered', tags: ['join', 'group_by', 'union'],
    description: `게시글 수(post_cnt)와 댓글 수(comment_cnt) 합산을 기준으로 가장 활발한 기여자 TOP 5의 username, post_cnt, comment_cnt, total_contributions를 조회하세요.`,
    solution_sql: `WITH contributions AS (SELECT u.id, u.username, COUNT(DISTINCT p.id) AS post_cnt, COUNT(DISTINCT c.id) AS comment_cnt FROM users u LEFT JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON u.id = c.user_id GROUP BY u.id, u.username) SELECT username, post_cnt, comment_cnt, post_cnt + comment_cnt AS total_contributions FROM contributions ORDER BY total_contributions DESC LIMIT 5;`,
  },
  {
    title: '태그별 평균 조회수',
    track: 'case', domain: 'community', dataset_domain: 'community', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'group_by', 'avg'],
    description: `태그별 게시글 평균 조회수(avg_views)를 조회하세요.\n- tags, post_tags, posts 조인\n- avg_views 내림차순 정렬`,
    solution_sql: `SELECT t.name, ROUND(AVG(p.view_cnt), 0) AS avg_views FROM tags t JOIN post_tags pt ON t.id = pt.tag_id JOIN posts p ON pt.post_id = p.id GROUP BY t.id, t.name ORDER BY avg_views DESC;`,
  },
  {
    title: '게시글 없는 유저',
    track: 'case', domain: 'community', dataset_domain: 'community', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['left_join', 'null'],
    description: `게시글을 한 번도 작성하지 않은 유저의 username과 reputation을 조회하세요.\n- LEFT JOIN + IS NULL 사용`,
    solution_sql: `SELECT u.username, u.reputation FROM users u LEFT JOIN posts p ON u.id = p.user_id WHERE p.id IS NULL ORDER BY u.reputation DESC;`,
  },
  {
    title: '팔로우 + 팔로워 현황',
    track: 'case', domain: 'community', dataset_domain: 'community', chapter_num: null,
    difficulty: 'hard', grading_mode: 'unordered', tags: ['join', 'group_by', 'subquery'],
    description: `유저별 팔로우 수(following_cnt)와 팔로워 수(follower_cnt)를 함께 조회하세요.\n- username, following_cnt, follower_cnt 출력\n- follower_cnt 내림차순 정렬`,
    solution_sql: `SELECT u.username, COUNT(DISTINCT f1.following_id) AS following_cnt, COUNT(DISTINCT f2.follower_id) AS follower_cnt FROM users u LEFT JOIN follows f1 ON u.id = f1.follower_id LEFT JOIN follows f2 ON u.id = f2.following_id GROUP BY u.id, u.username ORDER BY follower_cnt DESC;`,
  },
  {
    title: '전문가(expert) 유저의 평균 기여',
    track: 'case', domain: 'community', dataset_domain: 'community', chapter_num: null,
    difficulty: 'medium', grading_mode: 'unordered', tags: ['join', 'group_by', 'where'],
    description: `role이 'expert'인 유저의 평균 게시글 수(avg_posts)와 평균 댓글 수(avg_comments)를 조회하세요.`,
    solution_sql: `WITH expert_activity AS (SELECT u.id, COUNT(DISTINCT p.id) AS post_cnt, COUNT(DISTINCT c.id) AS comment_cnt FROM users u LEFT JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON u.id = c.user_id WHERE u.role = 'expert' GROUP BY u.id) SELECT ROUND(AVG(post_cnt), 1) AS avg_posts, ROUND(AVG(comment_cnt), 1) AS avg_comments FROM expert_activity;`,
  },
]
