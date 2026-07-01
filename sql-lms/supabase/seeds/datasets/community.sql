-- community: 커뮤니티/게시판 도메인 데이터셋
-- users / posts / comments / tags / post_tags / follows

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  username   TEXT    NOT NULL UNIQUE,
  email      TEXT    NOT NULL UNIQUE,
  reputation INTEGER NOT NULL DEFAULT 0,
  role       TEXT    NOT NULL DEFAULT 'member',
  created_at TEXT    NOT NULL,
  last_active TEXT   NOT NULL
);

CREATE TABLE posts (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  category   TEXT    NOT NULL,
  title      TEXT    NOT NULL,
  content    TEXT    NOT NULL,
  view_cnt   INTEGER NOT NULL DEFAULT 0,
  upvote_cnt INTEGER NOT NULL DEFAULT 0,
  comment_cnt INTEGER NOT NULL DEFAULT 0,
  is_pinned  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL
);

CREATE TABLE comments (
  id          INTEGER PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES posts(id),
  user_id     INTEGER NOT NULL REFERENCES users(id),
  content     TEXT    NOT NULL,
  upvote_cnt  INTEGER NOT NULL DEFAULT 0,
  is_accepted INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL
);

CREATE TABLE tags (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  cnt  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id),
  tag_id  INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE follows (
  follower_id  INTEGER NOT NULL REFERENCES users(id),
  following_id INTEGER NOT NULL REFERENCES users(id),
  created_at   TEXT    NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

INSERT INTO users VALUES
(1,  'sqlmaster',    'sqlmaster@dev.kr',    1850, 'expert',    '2020-03-10', '2024-03-20'),
(2,  'pythonista',   'pythonista@dev.kr',   1240, 'expert',    '2020-06-15', '2024-03-19'),
(3,  'newbie_coder', 'newbie@dev.kr',       120,  'member',    '2023-05-20', '2024-03-18'),
(4,  'data_wizard',  'datawiz@dev.kr',      980,  'expert',    '2021-02-10', '2024-03-20'),
(5,  'frontend_dev', 'frontend@dev.kr',     650,  'member',    '2021-09-01', '2024-03-17'),
(6,  'backend_guru', 'backend@dev.kr',      1120, 'expert',    '2020-11-20', '2024-03-20'),
(7,  'ml_engineer',  'mlengineer@dev.kr',   890,  'member',    '2022-01-15', '2024-03-16'),
(8,  'devops_pro',   'devops@dev.kr',       740,  'member',    '2021-07-10', '2024-03-19'),
(9,  'ux_designer',  'uxdesign@dev.kr',     320,  'member',    '2022-08-05', '2024-03-15'),
(10, 'product_pm',   'pm@dev.kr',           480,  'member',    '2022-03-20', '2024-03-18'),
(11, 'security_hawk','security@dev.kr',     1350, 'expert',    '2020-09-01', '2024-03-19'),
(12, 'cloud_native', 'cloud@dev.kr',        560,  'member',    '2022-05-10', '2024-03-17'),
(13, 'junior_dev1',  'juniordev1@dev.kr',   80,   'member',    '2024-01-10', '2024-03-16'),
(14, 'junior_dev2',  'juniordev2@dev.kr',   60,   'member',    '2024-01-20', '2024-03-15'),
(15, 'moderator1',   'mod1@dev.kr',         2100, 'moderator', '2019-12-01', '2024-03-20');

INSERT INTO posts VALUES
(1,  1,  'Q&A',        'SQL에서 GROUP BY와 HAVING의 차이점이 뭔가요?',              '...',  1250, 45, 8,  0, '2024-01-10'),
(2,  4,  '정보공유',   '2024년 데이터 분석가 커리어 로드맵 정리',                   '...', 8900, 234, 56, 1, '2024-01-15'),
(3,  2,  'Q&A',        'Python에서 pandas와 polars 중 뭘 써야 하나요?',             '...', 2100, 89,  23, 0, '2024-01-20'),
(4,  6,  '정보공유',   'REST API 설계 Best Practice 모음',                          '...', 5600, 178, 34, 0, '2024-01-22'),
(5,  1,  '정보공유',   'SQL 윈도우 함수 완전 정복 가이드',                          '...', 12000,389, 67, 1, '2024-01-25'),
(6,  5,  'Q&A',        'React 상태관리 Zustand vs Redux 어떤 게 나을까요?',         '...', 1890, 67,  18, 0, '2024-02-01'),
(7,  7,  '정보공유',   '머신러닝 입문자를 위한 필수 개념 정리',                     '...', 7800, 256, 45, 0, '2024-02-05'),
(8,  3,  'Q&A',        'Git merge vs rebase 언제 써야 해요?',                       '...', 980,  34,  12, 0, '2024-02-08'),
(9,  11, '정보공유',   'SQL Injection 방어 완전 가이드',                             '...', 9200, 312, 58, 1, '2024-02-10'),
(10, 8,  '정보공유',   'Docker 컨테이너 기초부터 실전까지',                         '...', 6700, 198, 41, 0, '2024-02-12'),
(11, 13, 'Q&A',        'SQL 서브쿼리와 JOIN 중 어떤 게 빠른가요?',                  '...', 560,  18,  7,  0, '2024-02-15'),
(12, 4,  '정보공유',   'A/B 테스트 설계 방법론',                                    '...', 4500, 156, 29, 0, '2024-02-18'),
(13, 2,  'Q&A',        'FastAPI vs Django 백엔드 프레임워크 선택 기준',              '...', 1780, 58,  15, 0, '2024-02-20'),
(14, 6,  '정보공유',   '마이크로서비스 아키텍처 실전 경험 공유',                    '...', 8100, 267, 52, 0, '2024-02-22'),
(15, 10, 'Q&A',        'PRD 작성할 때 어떤 항목을 꼭 포함시켜야 하나요?',           '...', 890,  29,  10, 0, '2024-02-25'),
(16, 1,  '정보공유',   'EXPLAIN으로 쿼리 성능 분석하기',                            '...', 5200, 189, 38, 0, '2024-03-01'),
(17, 5,  '프로젝트',   '사이드 프로젝트 팀원 구합니다 (React + Node.js)',            '...', 780,  23,  9,  0, '2024-03-05'),
(18, 7,  'Q&A',        '딥러닝에서 과적합 해결 방법 정리 부탁드려요',               '...', 1240, 45,  14, 0, '2024-03-08'),
(19, 4,  '정보공유',   'Airflow vs Prefect: 데이터 파이프라인 툴 비교',             '...', 3800, 134, 28, 0, '2024-03-10'),
(20, 9,  'Q&A',        'UI 컴포넌트 라이브러리 추천해주세요',                       '...', 670,  21,  8,  0, '2024-03-12'),
(21, 14, 'Q&A',        'AWS S3와 CloudFront 조합 설정 방법이 궁금해요',             '...', 450,  12,  5,  0, '2024-03-14'),
(22, 11, '정보공유',   'HTTPS와 TLS 1.3 마이그레이션 경험 공유',                   '...', 4200, 145, 32, 0, '2024-03-15'),
(23, 3,  'Q&A',        'NULL 값 처리 IS NULL vs COALESCE 언제 쓰나요?',             '...', 680,  24,  9,  0, '2024-03-16'),
(24, 12, '정보공유',   'Kubernetes 입문: Pod부터 Deployment까지',                   '...', 5900, 176, 35, 0, '2024-03-18'),
(25, 1,  '정보공유',   'CTE(WITH절)로 복잡한 쿼리 가독성 높이기',                  '...', 6700, 212, 44, 0, '2024-03-19');

INSERT INTO comments VALUES
(1,  1,  4,  'WHERE는 행 필터링, HAVING은 그룹 필터링입니다. GROUP BY 이후 집계 결과에 조건을 걸 때 HAVING을 씁니다.', 34, 1, '2024-01-10'),
(2,  1,  6,  'HAVING은 집계 함수(COUNT, SUM 등)와 함께 쓸 때 필수입니다.',                                           12, 0, '2024-01-11'),
(3,  1,  3,  '감사합니다! 이제 이해가 됐어요.',                                                                       5,  0, '2024-01-11'),
(4,  3,  6,  '데이터 규모가 크면 polars가 훨씬 빠릅니다. 1GB 이상이면 polars 추천.',                                 28, 1, '2024-01-20'),
(5,  3,  7,  'pandas가 생태계가 넓어서 pandas 먼저 익히는 걸 추천합니다.',                                           19, 0, '2024-01-21'),
(6,  5,  2,  'ROW_NUMBER, RANK, DENSE_RANK 차이도 꼭 알아야 합니다!',                                               45, 0, '2024-01-25'),
(7,  5,  7,  'LAG/LEAD 함수가 시계열 분석에서 정말 유용합니다.',                                                     38, 0, '2024-01-26'),
(8,  6,  2,  'Redux는 미들웨어 생태계가 강력하고, Zustand는 보일러플레이트가 적습니다. 팀 규모에 따라 선택하세요.',   32, 1, '2024-02-01'),
(9,  8,  1,  '공동 작업이면 merge, 개인 브랜치 정리라면 rebase가 일반적입니다.',                                     18, 1, '2024-02-08'),
(10, 9,  6,  'Parameterized Query만 제대로 써도 90% 방어됩니다.',                                                   67, 0, '2024-02-10'),
(11, 11, 1,  '실행 계획(EXPLAIN)으로 확인해보세요. 인덱스 여부에 따라 크게 달라집니다.',                             15, 1, '2024-02-15'),
(12, 11, 4,  'JOIN은 인덱스가 잘 걸려있으면 대부분 서브쿼리보다 빠릅니다.',                                          12, 0, '2024-02-16'),
(13, 13, 8,  'API 서버 용도라면 FastAPI, 어드민/풀스택이면 Django 추천합니다.',                                      25, 1, '2024-02-20'),
(14, 18, 4,  '드롭아웃, 배치 정규화, 데이터 증강을 조합하면 효과적입니다.',                                          19, 1, '2024-03-08'),
(15, 23, 6,  'IS NULL은 NULL 체크, COALESCE는 NULL을 다른 값으로 대체할 때 씁니다.',                                 22, 1, '2024-03-16'),
(16, 23, 1,  'NULL = NULL은 항상 FALSE입니다. 반드시 IS NULL을 써야 합니다.',                                        31, 0, '2024-03-16'),
(17, 25, 4,  'CTE는 재귀 쿼리에도 사용할 수 있어서 계층형 데이터 처리에 강력합니다.',                               28, 0, '2024-03-19'),
(18, 16, 2,  'EXPLAIN ANALYZE도 같이 보면 실제 실행 시간까지 나옵니다.',                                            35, 0, '2024-03-01'),
(19, 2,  13, '정말 유용한 글이에요. 북마크했습니다!',                                                                8,  0, '2024-01-15'),
(20, 7,  14, 'ML 공부 막막했는데 방향이 잡혔어요. 감사합니다.',                                                      12, 0, '2024-02-05');

INSERT INTO tags VALUES
(1,  'SQL',           45),
(2,  'Python',        38),
(3,  'JavaScript',    29),
(4,  'React',         22),
(5,  'Machine Learning', 18),
(6,  'Docker',        15),
(7,  'AWS',           12),
(8,  'API',           20),
(9,  'Git',           16),
(10, '데이터분석',    25),
(11, '보안',          14),
(12, 'Kubernetes',    9),
(13, 'FastAPI',       11),
(14, '커리어',        8),
(15, 'UX',            7);

INSERT INTO post_tags VALUES
(1,  1), (1,  10),
(2,  10), (2, 14),
(3,  2),  (3,  10),
(4,  8),
(5,  1),  (5,  10),
(6,  4),  (6,  3),
(7,  5),  (7,  10),
(8,  9),
(9,  1),  (9,  11),
(10, 6),
(11, 1),
(12, 10),
(13, 2),  (13, 8),  (13, 13),
(14, 8),
(15, 14),
(16, 1),  (16, 10),
(17, 4),  (17, 8),
(18, 5),
(19, 10),
(20, 15),
(21, 7),
(22, 11),
(23, 1),
(24, 6),  (24, 12),
(25, 1);

INSERT INTO follows VALUES
(3,  1,  '2024-01-10'),
(3,  4,  '2024-01-15'),
(3,  2,  '2024-01-20'),
(13, 1,  '2024-02-15'),
(13, 6,  '2024-02-16'),
(14, 4,  '2024-03-14'),
(14, 11, '2024-03-14'),
(9,  5,  '2024-02-01'),
(9,  1,  '2024-02-10'),
(10, 4,  '2024-02-18'),
(5,  6,  '2021-09-05'),
(5,  2,  '2021-09-10'),
(7,  2,  '2022-01-20'),
(7,  4,  '2022-01-20'),
(8,  6,  '2021-07-15'),
(12, 8,  '2022-05-15'),
(12, 6,  '2022-05-15'),
(2,  1,  '2020-06-20'),
(6,  1,  '2020-11-25'),
(4,  1,  '2021-02-15');
