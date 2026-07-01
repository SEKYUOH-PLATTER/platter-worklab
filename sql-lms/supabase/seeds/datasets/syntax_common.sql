-- syntax_common: 문법 실습용 기본 데이터셋
-- customers / products / orders 3개 테이블

CREATE TABLE customers (
  id        INTEGER PRIMARY KEY,
  name      TEXT    NOT NULL,
  email     TEXT    NOT NULL UNIQUE,
  city      TEXT    NOT NULL,
  grade     TEXT    NOT NULL DEFAULT 'regular',
  joined_at TEXT    NOT NULL
);

CREATE TABLE products (
  id        INTEGER PRIMARY KEY,
  name      TEXT    NOT NULL,
  category  TEXT    NOT NULL,
  price     INTEGER NOT NULL,
  stock     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'completed',
  ordered_at  TEXT    NOT NULL
);

INSERT INTO customers VALUES
(1,  '김민준', 'minjun@mail.com',    '서울', 'vip',      '2023-01-10'),
(2,  '이서연', 'seoyeon@mail.com',   '부산', 'regular',  '2023-02-14'),
(3,  '박지호', 'jiho@mail.com',      '서울', 'platinum', '2022-11-05'),
(4,  '최수아', 'sua@mail.com',       '인천', 'regular',  '2023-03-20'),
(5,  '정하은', 'haeun@mail.com',     '대구', 'vip',      '2022-09-01'),
(6,  '윤도현', 'dohyun@mail.com',    '서울', 'regular',  '2023-04-15'),
(7,  '임예린', 'yerin@mail.com',     '광주', 'regular',  '2023-05-08'),
(8,  '한승민', 'seungmin@mail.com',  '서울', 'vip',      '2022-12-20'),
(9,  '오지은', 'jieun@mail.com',     '부산', 'platinum', '2022-08-15'),
(10, '신태양', 'taeyang@mail.com',   '서울', 'regular',  '2023-06-01'),
(11, '강다은', 'daeun@mail.com',     '대전', 'regular',  '2023-07-10'),
(12, '문소희', 'sohee@mail.com',     '서울', 'vip',      '2023-01-25'),
(13, '배현우', 'hyunwoo@mail.com',   '인천', 'regular',  '2023-08-03'),
(14, '노은지', 'eunji@mail.com',     '서울', 'regular',  '2023-02-28'),
(15, '허지수', 'jisu@mail.com',      '부산', 'vip',      '2022-10-12'),
(16, '남준혁', 'junhyuk@mail.com',   '서울', 'platinum', '2022-07-20'),
(17, '조아영', 'ayoung@mail.com',    '광주', 'regular',  '2023-09-15'),
(18, '서민재', 'minjae@mail.com',    '서울', 'regular',  '2023-03-05'),
(19, '권나연', 'nayeon@mail.com',    '대구', 'vip',      '2023-04-20'),
(20, '유승호', 'seungho@mail.com',   '서울', 'regular',  '2023-10-01');

INSERT INTO products VALUES
(1,  '무선 이어폰',    '전자기기',  89000,  150),
(2,  '스마트워치',     '전자기기',  249000, 80),
(3,  '요가매트',       '스포츠',    45000,  200),
(4,  '텀블러',         '생활용품',  28000,  300),
(5,  '운동화',         '패션',      129000, 90),
(6,  '블루투스 스피커','전자기기',  159000, 60),
(7,  '노트북 파우치',  '액세서리',  35000,  250),
(8,  '캐리어 24인치',  '여행',      189000, 45),
(9,  '전기면도기',     '뷰티',      75000,  120),
(10, '독서대',         '생활용품',  22000,  350),
(11, '등산화',         '스포츠',    175000, 55),
(12, '커피머신',       '주방',      350000, 30),
(13, '에어프라이어',   '주방',      89000,  100),
(14, '미러리스 카메라','전자기기',  890000, 25),
(15, '자전거 헬멧',    '스포츠',    65000,  80);

INSERT INTO orders VALUES
(1,  3,  14, 1, 890000, 'completed', '2024-01-05'),
(2,  9,  12, 1, 350000, 'completed', '2024-01-08'),
(3,  1,  2,  1, 249000, 'completed', '2024-01-10'),
(4,  5,  11, 1, 175000, 'completed', '2024-01-12'),
(5,  16, 6,  2, 318000, 'completed', '2024-01-14'),
(6,  8,  1,  1, 89000,  'completed', '2024-01-15'),
(7,  3,  8,  1, 189000, 'completed', '2024-01-18'),
(8,  12, 5,  1, 129000, 'completed', '2024-01-20'),
(9,  2,  4,  2, 56000,  'completed', '2024-01-22'),
(10, 15, 1,  1, 89000,  'completed', '2024-01-25'),
(11, 6,  13, 1, 89000,  'completed', '2024-02-01'),
(12, 9,  3,  2, 90000,  'completed', '2024-02-03'),
(13, 1,  7,  1, 35000,  'completed', '2024-02-05'),
(14, 19, 2,  1, 249000, 'completed', '2024-02-08'),
(15, 4,  10, 3, 66000,  'completed', '2024-02-10'),
(16, 7,  4,  1, 28000,  'cancelled', '2024-02-12'),
(17, 11, 9,  1, 75000,  'completed', '2024-02-14'),
(18, 16, 14, 1, 890000, 'completed', '2024-02-15'),
(19, 3,  5,  1, 129000, 'pending',   '2024-02-18'),
(20, 20, 6,  1, 159000, 'completed', '2024-02-20'),
(21, 8,  12, 1, 350000, 'completed', '2024-03-01'),
(22, 5,  1,  2, 178000, 'completed', '2024-03-03'),
(23, 12, 15, 1, 65000,  'completed', '2024-03-05'),
(24, 9,  11, 1, 175000, 'completed', '2024-03-08'),
(25, 1,  13, 1, 89000,  'completed', '2024-03-10'),
(26, 15, 3,  1, 45000,  'cancelled', '2024-03-12'),
(27, 6,  2,  1, 249000, 'completed', '2024-03-14'),
(28, 19, 8,  1, 189000, 'pending',   '2024-03-15'),
(29, 3,  6,  1, 159000, 'completed', '2024-03-18'),
(30, 10, 7,  2, 70000,  'completed', '2024-03-20');
