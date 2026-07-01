-- ecommerce: 이커머스 도메인 데이터셋
-- users / products / orders / order_items / reviews

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  city       TEXT    NOT NULL,
  grade      TEXT    NOT NULL DEFAULT 'normal',
  created_at TEXT    NOT NULL
);

CREATE TABLE products (
  id          INTEGER PRIMARY KEY,
  name        TEXT    NOT NULL,
  category    TEXT    NOT NULL,
  brand       TEXT    NOT NULL,
  price       INTEGER NOT NULL,
  cost_price  INTEGER NOT NULL,
  stock_qty   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id           INTEGER PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  status       TEXT    NOT NULL DEFAULT 'completed',
  total_amount INTEGER NOT NULL,
  created_at   TEXT    NOT NULL
);

CREATE TABLE order_items (
  id         INTEGER PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL
);

CREATE TABLE reviews (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content    TEXT,
  created_at TEXT    NOT NULL
);

INSERT INTO users VALUES
(1,  '김민준', 'minjun@shop.com',   '서울',   'vip',    '2022-03-15'),
(2,  '이서연', 'seoyeon@shop.com',  '부산',   'normal', '2022-06-20'),
(3,  '박지호', 'jiho@shop.com',     '서울',   'gold',   '2021-11-05'),
(4,  '최수아', 'sua@shop.com',      '인천',   'normal', '2023-01-20'),
(5,  '정하은', 'haeun@shop.com',    '대구',   'vip',    '2021-09-01'),
(6,  '윤도현', 'dohyun@shop.com',   '서울',   'normal', '2023-04-15'),
(7,  '임예린', 'yerin@shop.com',    '광주',   'gold',   '2022-05-08'),
(8,  '한승민', 'seungmin@shop.com', '서울',   'vip',    '2021-12-20'),
(9,  '오지은', 'jieun@shop.com',    '부산',   'gold',   '2022-08-15'),
(10, '신태양', 'taeyang@shop.com',  '서울',   'normal', '2023-06-01'),
(11, '강다은', 'daeun@shop.com',    '대전',   'normal', '2023-07-10'),
(12, '문소희', 'sohee@shop.com',    '서울',   'vip',    '2022-01-25'),
(13, '배현우', 'hyunwoo@shop.com',  '인천',   'normal', '2023-08-03'),
(14, '노은지', 'eunji@shop.com',    '서울',   'gold',   '2022-09-28'),
(15, '허지수', 'jisu@shop.com',     '부산',   'vip',    '2021-10-12'),
(16, '남준혁', 'junhyuk@shop.com',  '서울',   'gold',   '2022-07-20'),
(17, '조아영', 'ayoung@shop.com',   '광주',   'normal', '2023-09-15'),
(18, '서민재', 'minjae@shop.com',   '서울',   'normal', '2023-03-05'),
(19, '권나연', 'nayeon@shop.com',   '대구',   'vip',    '2022-04-20'),
(20, '유승호', 'seungho@shop.com',  '서울',   'normal', '2023-10-01');

INSERT INTO products VALUES
(1,  '무선 노이즈캔슬링 이어폰', '전자기기', 'Sony',    189000, 95000,  120),
(2,  '스마트워치 Pro',           '전자기기', 'Samsung', 349000, 175000, 80),
(3,  '프리미엄 요가매트',        '스포츠',   'Manduka', 129000, 55000,  150),
(4,  '보온 텀블러 500ml',        '생활용품', '락앤락',  38000,  16000,  400),
(5,  '러닝화 경량',              '패션',     'Nike',    159000, 72000,  90),
(6,  '포터블 블루투스 스피커',   '전자기기', 'JBL',     129000, 58000,  60),
(7,  '15인치 노트북 슬림백',     '액세서리', 'Bellroy', 89000,  32000,  200),
(8,  '캐리어 24인치 경량',       '여행',     'Samsonite',229000, 105000, 45),
(9,  '전기 면도기 5단계',        '뷰티',     'Philips', 99000,  42000,  110),
(10, '대나무 독서대',            '생활용품', '자체제작', 29000,  10000,  500),
(11, '고어텍스 등산화',          '스포츠',   'Salomon', 219000, 98000,  55),
(12, '전자동 에스프레소 머신',   '주방',     'DeLonghi',489000, 215000, 25),
(13, '디지털 에어프라이어 5L',   '주방',     'Philips', 129000, 58000,  100),
(14, '미러리스 카메라 바디',     '전자기기', 'Sony',    1290000,630000, 20),
(15, '자전거 헬멧 경량',         '스포츠',   'Giro',    89000,  38000,  80),
(16, '스탠딩 데스크 매트',       '생활용품', '자체제작', 59000,  22000,  300),
(17, '비건 단백질 파우더 1kg',   '식품',     'MyProtein',49000, 18000,  250),
(18, '미세먼지 마스크 50매',     '생활용품', '자체제작', 25000,  8000,   600),
(19, '클렌징 오일 200ml',        '뷰티',     'Banila Co',28000, 11000,  350),
(20, '무선 충전 패드 15W',       '전자기기', 'Belkin',  45000,  18000,  220);

INSERT INTO orders VALUES
(1,  3,  'completed', 1290000, '2024-01-05'),
(2,  9,  'completed', 489000,  '2024-01-08'),
(3,  1,  'completed', 538000,  '2024-01-10'),
(4,  5,  'completed', 219000,  '2024-01-12'),
(5,  15, 'completed', 318000,  '2024-01-14'),
(6,  8,  'completed', 189000,  '2024-01-15'),
(7,  3,  'completed', 229000,  '2024-01-18'),
(8,  12, 'completed', 159000,  '2024-01-20'),
(9,  2,  'completed', 116000,  '2024-01-22'),
(10, 19, 'completed', 189000,  '2024-01-25'),
(11, 6,  'completed', 129000,  '2024-02-01'),
(12, 9,  'completed', 258000,  '2024-02-03'),
(13, 1,  'completed', 89000,   '2024-02-05'),
(14, 14, 'completed', 349000,  '2024-02-08'),
(15, 4,  'completed', 87000,   '2024-02-10'),
(16, 7,  'cancelled', 38000,   '2024-02-12'),
(17, 11, 'completed', 99000,   '2024-02-14'),
(18, 16, 'completed', 1290000, '2024-02-15'),
(19, 3,  'pending',   159000,  '2024-02-18'),
(20, 20, 'completed', 129000,  '2024-02-20'),
(21, 8,  'completed', 489000,  '2024-03-01'),
(22, 5,  'completed', 378000,  '2024-03-03'),
(23, 12, 'completed', 89000,   '2024-03-05'),
(24, 9,  'completed', 219000,  '2024-03-08'),
(25, 1,  'completed', 129000,  '2024-03-10'),
(26, 15, 'cancelled', 129000,  '2024-03-12'),
(27, 6,  'completed', 349000,  '2024-03-14'),
(28, 19, 'refunded',  229000,  '2024-03-15'),
(29, 3,  'completed', 129000,  '2024-03-18'),
(30, 10, 'completed', 118000,  '2024-03-20');

INSERT INTO order_items VALUES
(1,  1,  14, 1, 1290000),
(2,  2,  12, 1, 489000),
(3,  3,  1,  1, 189000),
(4,  3,  20, 1, 45000),
(5,  3,  10, 1, 29000),  -- intentionally 189+45+29 = 263 not matching order total (use total_amount from orders)
(6,  4,  11, 1, 219000),
(7,  5,  6,  1, 129000),
(8,  5,  4,  5, 190000),
(9,  6,  1,  1, 189000),
(10, 7,  8,  1, 229000),
(11, 8,  5,  1, 159000),
(12, 9,  4,  2, 76000),
(13, 9,  18, 1, 25000),
(14, 10, 1,  1, 189000),
(15, 11, 13, 1, 129000),
(16, 12, 3,  2, 258000),
(17, 13, 7,  1, 89000),
(18, 14, 2,  1, 349000),
(19, 15, 10, 3, 87000),
(20, 17, 9,  1, 99000),
(21, 18, 14, 1, 1290000),
(22, 19, 5,  1, 159000),
(23, 20, 13, 1, 129000),
(24, 21, 12, 1, 489000),
(25, 22, 5,  2, 318000),
(26, 22, 15, 1, 89000),  -- 318+89 = 407 not matching, intentional approx
(27, 23, 15, 1, 89000),
(28, 24, 11, 1, 219000),
(29, 25, 13, 1, 129000),
(30, 27, 2,  1, 349000),
(31, 29, 13, 1, 129000),
(32, 30, 4,  1, 38000),
(33, 30, 10, 1, 29000),
(34, 30, 18, 1, 25000),
(35, 30, 19, 1, 28000);

INSERT INTO reviews VALUES
(1,  3,  14, 5, '화질이 기대 이상입니다. 적극 추천!',        '2024-01-10'),
(2,  9,  12, 4, '커피 맛이 좋아요. 다만 소음이 좀 있어요.',  '2024-01-12'),
(3,  1,  1,  5, '음질 최고. 노이즈캔슬링 효과 탁월합니다.',  '2024-01-15'),
(4,  5,  11, 4, '발이 편하고 방수도 잘 됩니다.',             '2024-01-18'),
(5,  15, 6,  3, '소리는 좋은데 배터리가 아쉬워요.',          '2024-01-20'),
(6,  8,  1,  5, '일 년 넘게 쓰는데 고장 한 번 없어요.',      '2024-01-25'),
(7,  12, 5,  4, '착용감이 편해요. 사이즈는 크게 주문하세요.',  '2024-02-01'),
(8,  2,  4,  5, '보온력 대박. 6시간 지나도 따뜻해요.',       '2024-02-05'),
(9,  19, 2,  4, '디자인도 예쁘고 기능도 많아요.',            '2024-02-10'),
(10, 6,  13, 5, '요리 시간이 절반으로 줄었어요. 강추!',      '2024-02-15'),
(11, 9,  3,  5, '그립감이 훌륭하고 미끄럼 없어요.',          '2024-02-18'),
(12, 1,  7,  4, '수납공간이 많고 가벼워요.',                 '2024-02-20'),
(13, 14, 2,  3, '기능은 많은데 배터리가 2일이면 아쉬워요.',  '2024-02-22'),
(14, 4,  10, 5, '가성비 최고입니다. 배송도 빠르고요.',       '2024-03-01'),
(15, 11, 9,  4, '면도가 깔끔해요. 방수도 되고 좋아요.',      '2024-03-05'),
(16, 16, 14, 5, '전문 작가 수준의 사진이 나와요.',           '2024-03-08'),
(17, 3,  8,  5, '가볍고 튼튼해요. 공항에서 매우 편했어요.',  '2024-03-10'),
(18, 12, 15, 4, '가벼워서 장거리도 문제없어요.',             '2024-03-12'),
(19, 5,  1,  5, '출퇴근에 매일 씁니다. 최고예요.',           '2024-03-15'),
(20, 20, 13, 4, '온도 조절이 잘 되고 쉽게 씻겨요.',          '2024-03-18');
