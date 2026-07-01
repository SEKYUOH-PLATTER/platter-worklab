-- fintech: 핀테크/금융 도메인 데이터셋
-- users / accounts / transactions / cards

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  phone      TEXT    NOT NULL,
  kyc_status TEXT    NOT NULL DEFAULT 'verified',
  created_at TEXT    NOT NULL
);

CREATE TABLE accounts (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  type       TEXT    NOT NULL,
  balance    INTEGER NOT NULL DEFAULT 0,
  currency   TEXT    NOT NULL DEFAULT 'KRW',
  status     TEXT    NOT NULL DEFAULT 'active',
  created_at TEXT    NOT NULL
);

CREATE TABLE transactions (
  id             INTEGER PRIMARY KEY,
  account_id     INTEGER NOT NULL REFERENCES accounts(id),
  type           TEXT    NOT NULL,
  amount         INTEGER NOT NULL,
  balance_after  INTEGER NOT NULL,
  description    TEXT    NOT NULL,
  category       TEXT    NOT NULL DEFAULT 'general',
  status         TEXT    NOT NULL DEFAULT 'completed',
  created_at     TEXT    NOT NULL
);

CREATE TABLE cards (
  id           INTEGER PRIMARY KEY,
  account_id   INTEGER NOT NULL REFERENCES accounts(id),
  card_type    TEXT    NOT NULL DEFAULT 'debit',
  last_four    TEXT    NOT NULL,
  issued_at    TEXT    NOT NULL,
  expires_at   TEXT    NOT NULL,
  status       TEXT    NOT NULL DEFAULT 'active',
  monthly_limit INTEGER NOT NULL DEFAULT 3000000
);

INSERT INTO users VALUES
(1,  '김민준', 'minjun@finapp.com',   '010-1111-2222', 'verified',   '2022-01-10'),
(2,  '이서연', 'seoyeon@finapp.com',  '010-2222-3333', 'verified',   '2022-03-15'),
(3,  '박지호', 'jiho@finapp.com',     '010-3333-4444', 'verified',   '2021-11-20'),
(4,  '최수아', 'sua@finapp.com',      '010-4444-5555', 'pending',    '2023-01-05'),
(5,  '정하은', 'haeun@finapp.com',    '010-5555-6666', 'verified',   '2021-08-10'),
(6,  '윤도현', 'dohyun@finapp.com',   '010-6666-7777', 'verified',   '2022-06-20'),
(7,  '임예린', 'yerin@finapp.com',    '010-7777-8888', 'verified',   '2022-09-01'),
(8,  '한승민', 'seungmin@finapp.com', '010-8888-9999', 'verified',   '2021-05-15'),
(9,  '오지은', 'jieun@finapp.com',    '010-9999-0000', 'verified',   '2022-12-10'),
(10, '신태양', 'taeyang@finapp.com',  '010-0000-1111', 'rejected',   '2023-04-20');

INSERT INTO accounts VALUES
(1,  1, 'checking',  5230000,  'KRW', 'active', '2022-01-10'),
(2,  1, 'savings',   18900000, 'KRW', 'active', '2022-01-10'),
(3,  2, 'checking',  890000,   'KRW', 'active', '2022-03-15'),
(4,  3, 'checking',  12300000, 'KRW', 'active', '2021-11-20'),
(5,  3, 'savings',   45000000, 'KRW', 'active', '2021-11-20'),
(6,  4, 'checking',  150000,   'KRW', 'pending','2023-01-05'),
(7,  5, 'checking',  3400000,  'KRW', 'active', '2021-08-10'),
(8,  5, 'savings',   22000000, 'KRW', 'active', '2021-08-10'),
(9,  6, 'checking',  780000,   'KRW', 'active', '2022-06-20'),
(10, 7, 'checking',  2100000,  'KRW', 'active', '2022-09-01'),
(11, 8, 'checking',  9800000,  'KRW', 'active', '2021-05-15'),
(12, 8, 'savings',   67000000, 'KRW', 'active', '2021-05-15'),
(13, 9, 'checking',  450000,   'KRW', 'active', '2022-12-10'),
(14, 10,'checking',  0,        'KRW', 'frozen', '2023-04-20');

INSERT INTO transactions VALUES
(1,  1, 'deposit',   3000000,  8230000,  '급여 입금',         'income',        'completed', '2024-03-25'),
(2,  1, 'withdraw',  500000,   7730000,  '현금 인출',         'cash',          'completed', '2024-03-24'),
(3,  1, 'payment',   89000,    7641000,  '편의점 결제',       'shopping',      'completed', '2024-03-23'),
(4,  1, 'transfer',  1000000,  6641000,  '저축 이체',         'transfer',      'completed', '2024-03-20'),
(5,  1, 'payment',   350000,   6291000,  '식료품 구매',       'food',          'completed', '2024-03-18'),
(6,  1, 'payment',   1290000,  5001000,  '온라인 쇼핑',       'shopping',      'completed', '2024-03-15'),
(7,  2, 'deposit',   200000,   2090000,  '이자 입금',         'income',        'completed', '2024-03-01'),
(8,  3, 'deposit',   4500000,  5390000,  '급여 입금',         'income',        'completed', '2024-03-25'),
(9,  3, 'payment',   2800000,  2590000,  '월세 이체',         'housing',       'completed', '2024-03-01'),
(10, 3, 'payment',   120000,   2470000,  '통신비',            'utility',       'completed', '2024-03-05'),
(11, 4, 'deposit',   15000000, 27300000, '급여 입금',         'income',        'completed', '2024-03-25'),
(12, 4, 'payment',   850000,   26450000, '카드 결제',         'shopping',      'completed', '2024-03-20'),
(13, 4, 'payment',   500000,   25950000, '보험료',            'insurance',     'completed', '2024-03-10'),
(14, 5, 'deposit',   1000000,  46000000, '적금 납입',         'savings',       'completed', '2024-03-05'),
(15, 7, 'deposit',   5000000,  8400000,  '급여 입금',         'income',        'completed', '2024-03-25'),
(16, 7, 'payment',   2800000,  5600000,  '월세 이체',         'housing',       'completed', '2024-03-02'),
(17, 7, 'payment',   98000,    5502000,  '구독 서비스',       'subscription',  'completed', '2024-03-10'),
(18, 7, 'payment',   450000,   5052000,  '식당',              'food',          'completed', '2024-03-15'),
(19, 9, 'deposit',   3500000,  4280000,  '급여 입금',         'income',        'completed', '2024-03-25'),
(20, 9, 'payment',   1500000,  2780000,  '월세 이체',         'housing',       'completed', '2024-03-02'),
(21, 10,'deposit',   4800000,  6900000,  '급여 입금',         'income',        'completed', '2024-03-25'),
(22, 10,'payment',   380000,   6520000,  '마트 쇼핑',         'shopping',      'completed', '2024-03-18'),
(23, 11,'deposit',   8000000,  17800000, '급여 입금',         'income',        'completed', '2024-03-25'),
(24, 11,'payment',   3200000,  14600000, '월세 이체',         'housing',       'completed', '2024-03-02'),
(25, 11,'payment',   250000,   14350000, '교통비',            'transport',     'completed', '2024-03-20'),
(26, 11,'transfer',  5000000,  9350000,  '저축 이체',         'transfer',      'completed', '2024-03-05'),
(27, 13,'deposit',   2800000,  3250000,  '급여 입금',         'income',        'completed', '2024-03-25'),
(28, 13,'payment',   180000,   3070000,  '외식',              'food',          'completed', '2024-03-20'),
(29, 13,'payment',   35000,    3035000,  '카페',              'food',          'completed', '2024-03-22'),
(30, 1, 'payment',   1200000,  4031000,  '해외 구매',         'shopping',      'pending',   '2024-03-26');

INSERT INTO cards VALUES
(1,  1,  'debit',  '4521', '2022-01-10', '2027-01-31', 'active',    3000000),
(2,  2,  'debit',  '8834', '2022-01-10', '2027-01-31', 'active',    5000000),
(3,  3,  'debit',  '2219', '2022-03-15', '2027-03-31', 'active',    2000000),
(4,  4,  'debit',  '7743', '2021-11-20', '2026-11-30', 'active',    5000000),
(5,  7,  'debit',  '1138', '2021-08-10', '2026-08-31', 'active',    3000000),
(6,  9,  'debit',  '5562', '2022-06-20', '2027-06-30', 'active',    2000000),
(7,  10, 'debit',  '3391', '2022-09-01', '2027-09-30', 'active',    3000000),
(8,  11, 'debit',  '9907', '2021-05-15', '2026-05-31', 'active',    5000000),
(9,  12, 'credit', '4428', '2021-05-15', '2026-05-31', 'active',    10000000),
(10, 13, 'debit',  '6615', '2022-12-10', '2027-12-31', 'active',    1000000);
