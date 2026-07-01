-- hr: 인사/HR 도메인 데이터셋
-- departments / employees / attendance / performance_reviews / leaves

CREATE TABLE departments (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL UNIQUE,
  head_count INTEGER NOT NULL DEFAULT 0,
  budget     INTEGER NOT NULL,
  location   TEXT    NOT NULL DEFAULT '본사'
);

CREATE TABLE employees (
  id            INTEGER PRIMARY KEY,
  name          TEXT    NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  position      TEXT    NOT NULL,
  level         TEXT    NOT NULL DEFAULT 'junior',
  salary        INTEGER NOT NULL,
  manager_id    INTEGER REFERENCES employees(id),
  hired_at      TEXT    NOT NULL,
  status        TEXT    NOT NULL DEFAULT 'active'
);

CREATE TABLE attendance (
  id          INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  work_date   TEXT    NOT NULL,
  check_in    TEXT    NOT NULL,
  check_out   TEXT,
  work_type   TEXT    NOT NULL DEFAULT 'office',
  status      TEXT    NOT NULL DEFAULT 'normal'
);

CREATE TABLE performance_reviews (
  id          INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  reviewer_id INTEGER NOT NULL REFERENCES employees(id),
  period      TEXT    NOT NULL,
  score       INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  grade       TEXT    NOT NULL,
  comments    TEXT,
  reviewed_at TEXT    NOT NULL
);

CREATE TABLE leaves (
  id          INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  type        TEXT    NOT NULL,
  start_date  TEXT    NOT NULL,
  end_date    TEXT    NOT NULL,
  days        INTEGER NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'approved',
  reason      TEXT
);

INSERT INTO departments VALUES
(1, '개발팀',     32, 4800000000, '본사'),
(2, '마케팅팀',   15, 1800000000, '본사'),
(3, '영업팀',     25, 2200000000, '본사'),
(4, '인사팀',     8,  900000000,  '본사'),
(5, '재무팀',     10, 1100000000, '본사'),
(6, '디자인팀',   12, 1200000000, '본사'),
(7, '데이터팀',   18, 2800000000, '본사'),
(8, '고객지원팀', 20, 1500000000, '서울 지점');

INSERT INTO employees VALUES
(1,  '김도윤', 1, 'CTO',          'executive', 95000000,  NULL, '2018-03-01', 'active'),
(2,  '이준호', 1, '시니어 개발자', 'senior',     72000000,  1,    '2019-06-15', 'active'),
(3,  '박소율', 1, '개발자',        'mid',         55000000,  2,    '2021-03-10', 'active'),
(4,  '최지우', 1, '개발자',        'mid',         52000000,  2,    '2021-07-20', 'active'),
(5,  '정우진', 1, '주니어 개발자', 'junior',      40000000,  2,    '2023-02-01', 'active'),
(6,  '윤서아', 1, '주니어 개발자', 'junior',      38000000,  2,    '2023-08-15', 'active'),
(7,  '임채원', 2, '마케팅 본부장', 'manager',     75000000,  NULL, '2018-09-01', 'active'),
(8,  '한예린', 2, '마케터',        'mid',         52000000,  7,    '2020-05-10', 'active'),
(9,  '오도현', 2, '마케터',        'junior',      39000000,  7,    '2022-11-01', 'active'),
(10, '신민아', 3, '영업 본부장',   'manager',     78000000,  NULL, '2017-04-15', 'active'),
(11, '강준서', 3, '영업 팀장',     'senior',      65000000,  10,   '2019-08-01', 'active'),
(12, '문지수', 3, '영업 담당자',   'mid',         50000000,  11,   '2021-01-20', 'active'),
(13, '배현수', 3, '영업 담당자',   'junior',      38000000,  11,   '2023-05-01', 'active'),
(14, '노다은', 4, 'HR 팀장',       'senior',      70000000,  NULL, '2018-02-01', 'active'),
(15, '허지원', 4, 'HR 담당자',     'mid',         53000000,  14,   '2020-09-15', 'active'),
(16, '남승현', 5, '재무 팀장',     'senior',      72000000,  NULL, '2019-01-10', 'active'),
(17, '조하린', 5, '재무 담당자',   'mid',         54000000,  16,   '2021-06-01', 'active'),
(18, '서민준', 6, '디자인 팀장',   'senior',      68000000,  NULL, '2019-03-20', 'active'),
(19, '권나은', 6, '디자이너',      'mid',         51000000,  18,   '2021-11-10', 'active'),
(20, '유재원', 7, '데이터 팀장',   'senior',      80000000,  NULL, '2018-07-01', 'active'),
(21, '이아영', 7, '데이터 분석가', 'mid',         60000000,  20,   '2020-10-15', 'active'),
(22, '김태준', 7, '데이터 분석가', 'mid',         58000000,  20,   '2021-04-01', 'active'),
(23, '박수빈', 7, '주니어 DA',     'junior',      42000000,  20,   '2023-01-15', 'active'),
(24, '최예나', 8, 'CS 팀장',       'senior',      62000000,  NULL, '2019-05-01', 'active'),
(25, '정시우', 8, 'CS 담당자',     'junior',      36000000,  24,   '2023-09-01', 'active');

INSERT INTO attendance VALUES
(1,  1,  '2024-03-18', '09:02', '19:15', 'office', 'normal'),
(2,  1,  '2024-03-19', '09:10', '18:45', 'office', 'normal'),
(3,  1,  '2024-03-20', '08:55', '20:00', 'office', 'overtime'),
(4,  2,  '2024-03-18', '09:30', '18:30', 'remote', 'normal'),
(5,  2,  '2024-03-19', '09:05', '18:15', 'office', 'normal'),
(6,  2,  '2024-03-20', '09:00', '18:00', 'office', 'normal'),
(7,  3,  '2024-03-18', '10:15', '19:00', 'office', 'late'),
(8,  3,  '2024-03-19', '09:00', '18:00', 'office', 'normal'),
(9,  3,  '2024-03-20', '09:05', '18:10', 'remote', 'normal'),
(10, 4,  '2024-03-18', '09:00', '18:00', 'office', 'normal'),
(11, 4,  '2024-03-19', '09:00', NULL,    'office', 'absent'),
(12, 4,  '2024-03-20', '09:10', '18:30', 'office', 'normal'),
(13, 5,  '2024-03-18', '09:30', '18:00', 'office', 'normal'),
(14, 5,  '2024-03-19', '10:30', '18:00', 'office', 'late'),
(15, 5,  '2024-03-20', '09:00', '18:00', 'office', 'normal'),
(16, 7,  '2024-03-18', '08:45', '19:00', 'office', 'overtime'),
(17, 7,  '2024-03-19', '08:50', '18:30', 'office', 'normal'),
(18, 8,  '2024-03-18', '09:00', '18:00', 'remote', 'normal'),
(19, 8,  '2024-03-19', '09:05', '18:05', 'office', 'normal'),
(20, 10, '2024-03-18', '08:30', '19:30', 'office', 'overtime'),
(21, 20, '2024-03-18', '09:00', '19:00', 'office', 'overtime'),
(22, 20, '2024-03-19', '09:00', '18:30', 'office', 'normal'),
(23, 21, '2024-03-18', '09:10', '18:10', 'office', 'normal'),
(24, 22, '2024-03-18', '09:00', '18:00', 'remote', 'normal'),
(25, 23, '2024-03-18', '09:30', '18:30', 'office', 'normal'),
(26, 14, '2024-03-18', '09:00', '18:00', 'office', 'normal'),
(27, 15, '2024-03-18', '09:05', '18:05', 'office', 'normal'),
(28, 16, '2024-03-18', '08:55', '18:55', 'office', 'normal'),
(29, 18, '2024-03-18', '09:00', '18:30', 'office', 'normal'),
(30, 25, '2024-03-18', '10:30', '18:00', 'office', 'late');

INSERT INTO performance_reviews VALUES
(1,  2,  1,  '2023H2', 5, 'S',  '기술 리더십 탁월',          '2024-01-15'),
(2,  3,  2,  '2023H2', 4, 'A',  '성장 속도 우수',             '2024-01-15'),
(3,  4,  2,  '2023H2', 3, 'B',  '안정적인 성과',              '2024-01-15'),
(4,  5,  2,  '2023H2', 3, 'B',  '신입치고 적응 빠름',         '2024-01-15'),
(5,  6,  2,  '2023H2', 2, 'C',  '업무 집중도 개선 필요',      '2024-01-15'),
(6,  8,  7,  '2023H2', 5, 'S',  '캠페인 성과 최상',           '2024-01-15'),
(7,  9,  7,  '2023H2', 3, 'B',  '성실하나 결과 개선 필요',    '2024-01-15'),
(8,  11, 10, '2023H2', 4, 'A',  '영업 목표 초과 달성',        '2024-01-15'),
(9,  12, 11, '2023H2', 4, 'A',  '고객 만족도 높음',           '2024-01-15'),
(10, 13, 11, '2023H2', 3, 'B',  '신입 적응 완료',             '2024-01-15'),
(11, 15, 14, '2023H2', 5, 'S',  '채용 프로세스 개선 공헌',    '2024-01-15'),
(12, 17, 16, '2023H2', 4, 'A',  '결산 정확도 높음',           '2024-01-15'),
(13, 19, 18, '2023H2', 4, 'A',  '브랜드 일관성 유지 우수',    '2024-01-15'),
(14, 21, 20, '2023H2', 5, 'S',  '데이터 기반 의사결정 탁월',  '2024-01-15'),
(15, 22, 20, '2023H2', 4, 'A',  '분석 품질 우수',             '2024-01-15'),
(16, 23, 20, '2023H2', 3, 'B',  '쿼리 최적화 학습 중',        '2024-01-15'),
(17, 2,  1,  '2023H1', 4, 'A',  '상반기 프로젝트 리드 성공', '2023-07-20'),
(18, 3,  2,  '2023H1', 4, 'A',  '코드 품질 개선',             '2023-07-20'),
(19, 21, 20, '2023H1', 4, 'A',  '대시보드 구축 공헌',         '2023-07-20'),
(20, 8,  7,  '2023H1', 4, 'A',  'SNS 운영 성과 우수',         '2023-07-20');

INSERT INTO leaves VALUES
(1,  3,  '연차',     '2024-02-15', '2024-02-15', 1, 'approved', '개인 사정'),
(2,  3,  '연차',     '2024-03-04', '2024-03-05', 2, 'approved', '여행'),
(3,  5,  '연차',     '2024-02-19', '2024-02-20', 2, 'approved', '결혼식 참석'),
(4,  6,  '병가',     '2024-01-08', '2024-01-10', 3, 'approved', '독감'),
(5,  8,  '연차',     '2024-03-11', '2024-03-12', 2, 'approved', '가족 행사'),
(6,  9,  '연차',     '2024-02-26', '2024-02-29', 4, 'approved', '해외여행'),
(7,  12, '반차',     '2024-03-07', '2024-03-07', 1, 'approved', '병원 방문'),
(8,  13, '연차',     '2024-02-08', '2024-02-08', 1, 'approved', '개인 사정'),
(9,  15, '연차',     '2024-03-14', '2024-03-15', 2, 'approved', '교육 참석'),
(10, 19, '연차',     '2024-01-22', '2024-01-22', 1, 'approved', '개인 사정'),
(11, 21, '연차',     '2024-02-01', '2024-02-02', 2, 'approved', '휴식'),
(12, 22, '병가',     '2024-01-15', '2024-01-17', 3, 'approved', '수술 후 회복'),
(13, 23, '연차',     '2024-03-18', '2024-03-18', 1, 'approved', '개인 사정'),
(14, 25, '연차',     '2024-02-13', '2024-02-14', 2, 'approved', '가족 여행'),
(15, 4,  '연차',     '2024-03-19', '2024-03-19', 1, 'pending',  '개인 사정'),
(16, 7,  '연차',     '2024-04-01', '2024-04-05', 5, 'pending',  '해외여행'),
(17, 10, '출장',     '2024-03-25', '2024-03-27', 3, 'approved', '거래처 미팅'),
(18, 11, '출장',     '2024-03-26', '2024-03-28', 3, 'approved', '지방 영업'),
(19, 20, '출장',     '2024-04-02', '2024-04-03', 2, 'approved', '컨퍼런스'),
(20, 2,  '육아휴직', '2024-05-01', '2024-10-31', 130,'approved', '출산');
