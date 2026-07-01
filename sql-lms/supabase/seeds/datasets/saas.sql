-- saas: SaaS 비즈니스 도메인 데이터셋
-- companies / users / subscriptions / events

CREATE TABLE companies (
  id          INTEGER PRIMARY KEY,
  name        TEXT    NOT NULL,
  industry    TEXT    NOT NULL,
  plan        TEXT    NOT NULL DEFAULT 'starter',
  employee_cnt INTEGER NOT NULL DEFAULT 1,
  mrr         INTEGER NOT NULL DEFAULT 0,
  country     TEXT    NOT NULL DEFAULT 'KR',
  created_at  TEXT    NOT NULL,
  churned_at  TEXT
);

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id),
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  role       TEXT    NOT NULL DEFAULT 'member',
  created_at TEXT    NOT NULL,
  last_login TEXT
);

CREATE TABLE subscriptions (
  id           INTEGER PRIMARY KEY,
  company_id   INTEGER NOT NULL REFERENCES companies(id),
  plan         TEXT    NOT NULL,
  amount       INTEGER NOT NULL,
  billing_cycle TEXT   NOT NULL DEFAULT 'monthly',
  started_at   TEXT    NOT NULL,
  ended_at     TEXT
);

CREATE TABLE events (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  event_name TEXT    NOT NULL,
  page       TEXT,
  created_at TEXT    NOT NULL
);

INSERT INTO companies VALUES
(1,  'TechFlow Inc.',    'IT/소프트웨어',  'growth',     85,  490000, 'KR', '2021-03-10', NULL),
(2,  '마케팅위즈',       '마케팅/광고',    'starter',    12,  49000,  'KR', '2022-07-15', NULL),
(3,  'DataPilot',        '데이터/AI',      'enterprise', 320, 2900000,'KR', '2020-11-20', NULL),
(4,  '핀테크파트너스',   '금융',           'growth',     45,  290000, 'KR', '2021-09-05', NULL),
(5,  'CloudNine Korea',  'IT/소프트웨어',  'enterprise', 150, 1200000,'KR', '2020-06-01', NULL),
(6,  '소셜팩토리',       '소셜미디어',     'starter',    8,   29000,  'KR', '2023-02-20', NULL),
(7,  'RetailHub',        '유통/물류',      'growth',     60,  390000, 'KR', '2021-12-10', NULL),
(8,  'MedBridge',        '의료/헬스케어',  'enterprise', 200, 1800000,'KR', '2020-04-15', NULL),
(9,  '에듀스마트',       '교육',           'starter',    5,   19000,  'KR', '2023-05-01', NULL),
(10, 'GreenOps',         '환경/에너지',    'growth',     35,  190000, 'KR', '2022-03-08', NULL),
(11, '스타트업랩',       'IT/소프트웨어',  'starter',    3,   0,      'KR', '2023-08-15', '2024-01-10'),
(12, 'FoodTech KR',      '식품/외식',      'growth',     55,  290000, 'KR', '2021-06-20', NULL),
(13, 'ManufactureX',     '제조',           'enterprise', 500, 4900000,'KR', '2019-09-01', NULL),
(14, '로컬커머스',       '이커머스',       'starter',    10,  39000,  'KR', '2022-11-15', NULL),
(15, 'HRSuite',          '인사/HR',        'growth',     40,  240000, 'KR', '2022-01-20', NULL),
(16, '디지털헬스케어',   '의료/헬스케어',  'starter',    7,   0,      'KR', '2023-04-10', '2023-12-31'),
(17, 'PropertyTech',     '부동산',         'growth',     70,  490000, 'KR', '2021-07-05', NULL),
(18, '게임플랫폼',       '게임/엔터',      'enterprise', 120, 890000, 'KR', '2020-10-15', NULL),
(19, 'AutomateFlow',     'IT/소프트웨어',  'growth',     30,  190000, 'KR', '2022-05-25', NULL),
(20, 'TravelTech',       '여행/관광',      'starter',    15,  49000,  'KR', '2022-09-10', NULL);

INSERT INTO users VALUES
(1,  1,  '김도윤', 'doyun@techflow.com',    'admin',   '2021-03-10', '2024-03-20'),
(2,  1,  '박소율', 'soyul@techflow.com',    'member',  '2021-04-15', '2024-03-19'),
(3,  1,  '이준호', 'junho@techflow.com',    'member',  '2022-01-10', '2024-03-18'),
(4,  2,  '최아린', 'arin@marketingwiz.com', 'admin',   '2022-07-15', '2024-03-15'),
(5,  2,  '정유진', 'yujin@marketingwiz.com','member',  '2022-08-01', '2024-03-10'),
(6,  3,  '윤재원', 'jaewon@datapilot.com',  'admin',   '2020-11-20', '2024-03-20'),
(7,  3,  '임지현', 'jihyun@datapilot.com',  'manager', '2021-02-15', '2024-03-19'),
(8,  3,  '한서준', 'seojun@datapilot.com',  'member',  '2021-06-01', '2024-03-17'),
(9,  4,  '오민서', 'minseo@fintech.com',    'admin',   '2021-09-05', '2024-03-20'),
(10, 5,  '신지아', 'jia@cloudnine.com',     'admin',   '2020-06-01', '2024-03-18'),
(11, 5,  '강현준', 'hyunjun@cloudnine.com', 'manager', '2020-09-10', '2024-03-15'),
(12, 6,  '문예은', 'yeeun@socialfact.com',  'admin',   '2023-02-20', '2024-03-12'),
(13, 7,  '배태경', 'taekyung@retailhub.com','admin',   '2021-12-10', '2024-03-20'),
(14, 8,  '노하린', 'harin@medbridge.com',   'admin',   '2020-04-15', '2024-03-19'),
(15, 9,  '허승현', 'seunghyun@edusmart.com','admin',   '2023-05-01', '2024-03-08'),
(16, 10, '남다인', 'dain@greenops.com',     'admin',   '2022-03-08', '2024-03-17'),
(17, 12, '조현수', 'hyunsu@foodtech.com',   'admin',   '2021-06-20', '2024-03-20'),
(18, 13, '서진우', 'jinwoo@manufacturex.com','admin',  '2019-09-01', '2024-03-18'),
(19, 15, '권미래', 'mirae@hrsuite.com',     'admin',   '2022-01-20', '2024-03-15'),
(20, 17, '유하준', 'hajun@propertytech.com','admin',   '2021-07-05', '2024-03-20');

INSERT INTO subscriptions VALUES
(1,  1,  'growth',     490000,  'monthly', '2021-03-10', NULL),
(2,  2,  'starter',    49000,   'monthly', '2022-07-15', NULL),
(3,  3,  'enterprise', 2900000, 'monthly', '2020-11-20', NULL),
(4,  4,  'growth',     290000,  'monthly', '2021-09-05', NULL),
(5,  5,  'enterprise', 1200000, 'monthly', '2020-06-01', NULL),
(6,  6,  'starter',    29000,   'monthly', '2023-02-20', NULL),
(7,  7,  'growth',     390000,  'monthly', '2021-12-10', NULL),
(8,  8,  'enterprise', 1800000, 'monthly', '2020-04-15', NULL),
(9,  9,  'starter',    19000,   'monthly', '2023-05-01', NULL),
(10, 10, 'growth',     190000,  'monthly', '2022-03-08', NULL),
(11, 11, 'starter',    49000,   'monthly', '2023-08-15', '2024-01-10'),
(12, 12, 'growth',     290000,  'monthly', '2021-06-20', NULL),
(13, 13, 'enterprise', 4900000, 'monthly', '2019-09-01', NULL),
(14, 14, 'starter',    39000,   'monthly', '2022-11-15', NULL),
(15, 15, 'growth',     240000,  'monthly', '2022-01-20', NULL),
(16, 16, 'starter',    29000,   'monthly', '2023-04-10', '2023-12-31'),
(17, 17, 'growth',     490000,  'monthly', '2021-07-05', NULL),
(18, 18, 'enterprise', 890000,  'monthly', '2020-10-15', NULL),
(19, 19, 'growth',     190000,  'monthly', '2022-05-25', NULL),
(20, 20, 'starter',    49000,   'monthly', '2022-09-10', NULL),
-- plan upgrades
(21, 2,  'starter',    29000,   'monthly', '2022-07-15', '2023-01-14'),
(22, 2,  'growth',     290000,  'monthly', '2023-01-15', '2023-07-14'),
(23, 9,  'starter',    19000,   'monthly', '2023-05-01', '2023-11-30'),
(24, 9,  'growth',     190000,  'monthly', '2023-12-01', NULL);

INSERT INTO events VALUES
(1,  1,  'login',           '/dashboard',          '2024-03-20 09:01:00'),
(2,  1,  'page_view',       '/analytics',          '2024-03-20 09:05:00'),
(3,  1,  'feature_use',     '/reports/create',     '2024-03-20 09:15:00'),
(4,  2,  'login',           '/dashboard',          '2024-03-19 14:00:00'),
(5,  2,  'page_view',       '/team',               '2024-03-19 14:05:00'),
(6,  3,  'login',           '/dashboard',          '2024-03-18 10:00:00'),
(7,  3,  'feature_use',     '/integrations',       '2024-03-18 10:20:00'),
(8,  4,  'login',           '/dashboard',          '2024-03-15 09:00:00'),
(9,  4,  'feature_use',     '/campaigns/create',   '2024-03-15 09:30:00'),
(10, 5,  'login',           '/dashboard',          '2024-03-10 11:00:00'),
(11, 6,  'login',           '/dashboard',          '2024-03-20 08:30:00'),
(12, 6,  'page_view',       '/analytics',          '2024-03-20 08:35:00'),
(13, 6,  'feature_use',     '/reports/view',       '2024-03-20 08:45:00'),
(14, 6,  'feature_use',     '/exports',            '2024-03-20 09:00:00'),
(15, 7,  'login',           '/dashboard',          '2024-03-19 13:00:00'),
(16, 7,  'feature_use',     '/pipelines',          '2024-03-19 13:20:00'),
(17, 8,  'login',           '/dashboard',          '2024-03-17 09:00:00'),
(18, 9,  'login',           '/dashboard',          '2024-03-20 07:00:00'),
(19, 9,  'feature_use',     '/data/upload',        '2024-03-20 07:15:00'),
(20, 9,  'feature_use',     '/models/train',       '2024-03-20 08:00:00'),
(21, 10, 'login',           '/dashboard',          '2024-03-18 09:00:00'),
(22, 11, 'login',           '/dashboard',          '2024-03-15 10:00:00'),
(23, 13, 'login',           '/dashboard',          '2024-03-20 09:00:00'),
(24, 13, 'feature_use',     '/orders/manage',      '2024-03-20 09:20:00'),
(25, 14, 'login',           '/dashboard',          '2024-03-19 16:00:00'),
(26, 15, 'login',           '/dashboard',          '2024-03-08 10:00:00'),
(27, 16, 'login',           '/dashboard',          '2024-03-17 09:30:00'),
(28, 17, 'login',           '/dashboard',          '2024-03-20 08:00:00'),
(29, 17, 'feature_use',     '/inventory',          '2024-03-20 08:30:00'),
(30, 18, 'login',           '/dashboard',          '2024-03-18 09:00:00'),
(31, 19, 'login',           '/dashboard',          '2024-03-15 14:00:00'),
(32, 20, 'login',           '/dashboard',          '2024-03-20 09:00:00'),
(33, 20, 'page_view',       '/settings/billing',   '2024-03-20 09:10:00'),
(34, 1,  'logout',          NULL,                  '2024-03-20 18:00:00'),
(35, 6,  'logout',          NULL,                  '2024-03-20 17:30:00');
