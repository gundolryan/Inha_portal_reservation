USE inha_reserv;

-- INSERT, UPDATE 등을 위해 'Safe Update Mode'를 임시 비활성화
SET SQL_SAFE_UPDATES = 0;

-- --- Roles, Colleges, Departments (data.sql) ---
INSERT INTO Roles (name)
VALUES ('student'), ('professor'), ('staff'), ('admin');

INSERT INTO Colleges (name)
VALUES
('공과대학'), ('자연과학대학'), ('경영대학'), ('사범대학'), ('사회과학대학'),
('문과대학'), ('의과대학'), ('예술체육대학'), ('미래융합대학'), ('바이오시스템융합학부'),
('소프트웨어융합대학'), ('간호대학'), ('프런티어창의대학'), ('국제학부');

INSERT INTO Departments (college_id, name)
VALUES
-- 공과대학 (1)
(1, '기계공학과'), (1, '항공우주공학과'), (1, '사회인프라공학과'), (1, '에너지자원공학과'), (1, '조선해양공학과'),
(1, '산업경영공학과'), (1, '화학공학과'), (1, '고분자공학과'), (1, '환경공학과'), (1, '공간정보공학과'),
(1, '건축공학과'), (1, '전기전자공학부'), (1, '신소재공학과'), (1, '반도체시스템공학과'), (1, '이차전지융합학과'), (1, '융합기술경영학부'),
-- 자연과학대학 (2)
(2, '통계학과'), (2, '물리학과'), (2, '수학과'), (2, '화학과'), (2, '해양과학과'), (2, '식품영양학과'),
-- 경영대학 (3)
(3, '경영학과'), (3, '파이낸스경영학과'), (3, '아태물류학부'), (3, '국제통상학과'),
-- 사범대학 (4)
(4, '국어교육과'), (4, '영어교육과'), (4, '사회교육과'), (4, '교육학과'), (4, '체육교육과'), (4, '수학교육과'),
-- 사회과학대학 (5)
(5, '행정학과'), (5, '정치외교학과'), (5, '미디어커뮤니케이션학과'), (5, '경제학과'), (5, '소비자학과'),
(5, '아동심리학과'), (5, '사회복지학과'),
-- 문과대학 (6)
(6, '한국어문학과'), (6, '사학과'), (6, '철학과'), (6, '중국학과'), (6, '일본언어문화학과'),
(6, '문화콘텐츠문화경영학과'), (6, '영미유럽인문융합학부'),
-- 의과대학 (7)
(7, '의예과'), (7, '의학과'),
-- 예술체육대학 (8)
(8, '연극영화학과'), (8, '조형예술학과'), (8, '디자인융합학과'), (8, '스포츠과학과'), (8, '의류디자인학과'),
-- 미래융합대학 (9)
(9, '산업경영학과'), (9, '소프트웨어융합공학과'), (9, '메카트로닉스공학과'), (9, '금융투자학과'), (9, '반도체산업융합학과'),
-- 바이오시스템융합학부 (10)
(10, '생명공학과'), (10, '생명과학과'), (10, '첨단바이오의약학과'),
-- 소프트웨어융합대학 (11)
(11, '인공지능공학과'), (11, '데이터사이언스학과'), (11, '스마트모빌리티공학과'), (11, '디자인테크놀로지학과'), (11, '컴퓨터공학과'),
-- 간호대학 (12)
(12, '간호학과'),
-- 프런티어창의대학 (13)
(13, '자유전공융합학부'), (13, '공학융합학부'), (13, '자연과학융합학부'), (13, '경영융합학부'),
(13, '사회과학융합학부'), (13, '인문융합학부'),
-- 국제학부 (14)
(14, 'IBT학과'), (14, 'ISE학과'), (14, 'KLC학과');

-- --- Users (data.sql + add1.sql) ---
INSERT INTO Users (student_id, password, name, email, dept_id, phone, role_id)
VALUES 
-- 관리자 (add1.sql) / user_id = 1
('A2025001', '$2b$12$7rA5pNQk2LZyV9Qh1qVvZOH5EAdkzD9B3fE7R8wN.XkS9fS7y2gWy', '관리자', 'admin@inha.ac.kr', NULL, '010-0000-0000', 4),
-- 일반 학생 (data.sql) - '김건우' 님 정보로 수정 / user_id = 2
('20211234', '$2b$12$N9qo8uLOickgx2ZMRZo4ieO5xU8HsdQab3cxycGaG5jN/z7eZrguW', '김건우', 'kim.geonwoo@inha.ac.kr', 65, '010-1234-5678', 1),
-- 교수 (data.sql) - '이서연' 정보로 수정 / user_id = 3
('P2024001', '$2b$12$4s3Xy5uVYbWQkzq3rRZc3Oc4cLq2gXh0pVZ/nD9aG4SxLu7fD0p2u', '이서연', 's.lee@inha.ac.kr', 12, '010-2222-3333', 2),
-- 조교/직원 (data.sql) - '박지훈' 정보로 수정 / user_id = 4
('S2023001', '$2b$12$H1A7uQxq4p9Q9Jb4mCkHhe1B1aXrPtU5z/x5bQ8mOEl4cUvF7YpNu', '박지훈', 'jihoon.park@inha.ac.kr', 1, '010-4444-5555', 3),
-- 기타 사용자 / user_id = 5 ~ 11
('20221001', '$2b$12$N9qo8uLOickgx2ZMRZo4ieO5xU8HsdQab3cxycGaG5jN/z7eZrguW', '최수빈', 'subin.choi@inha.ac.kr', 66, '010-1111-2222', 1),
('20232002', '$2b$12$N9qo8uLOickgx2ZMRZo4ieO5xU8HsdQab3cxycGaG5jN/z7eZrguW', '정다은', 'daeun.jung@inha.ac.kr', 23, '010-3333-4444', 1),
('20203003', '$2b$12$N9qo8uLOickgx2ZMRZo4ieO5xU8HsdQab3cxycGaG5jN/z7eZrguW', '윤태현', 'th.yoon@inha.ac.kr', 44, '010-5555-6666', 1),
('20224004', '$2b$12$N9qo8uLOickgx2ZMRZo4ieO5xU8HsdQab3cxycGaG5jN/z7eZrguW', '한유진', 'yujin.han@inha.ac.kr', 7, '010-7777-8888', 1),
('P2022002', '$2b$12$4s3Xy5uVYbWQkzq3rRZc3Oc4cLq2gXh0pVZ/nD9aG4SxLu7fD0p2u', '배성호', 'sh.bae@inha.ac.kr', 11, '010-8888-9999', 2),
('S2024002', '$2b$12$H1A7uQxq4p9Q9Jb4mCkHhe1B1aXrPtU5z/x5bQ8mOEl4cUvF7YpNu', '신아름', 'areum.shin@inha.ac.kr', 36, '010-9999-0000', 3),
('20235005', '$2b$12$N9qo8uLOickgx2ZMRZo4ieO5xU8HsdQab3cxycGaG5jN/z7eZrguW', '강민재', 'mj.kang@inha.ac.kr', 31, '010-0000-1111', 1);


-- --- Facilities (data.sql + 사용자 요청) ---
INSERT INTO FacilityCategory1 (name)
VALUES ('스터디룸'), ('체육시설'), ('가무연습실'), ('강의실'), ('강당'), ('기타');

INSERT INTO FacilityCategory2 (cat1_id, name)
VALUES
(1, '인문스터디룸'), (1, '해동스터디룸'), (1, '학생라운지스터디룸'),
(2, '운동장'), (2, '테니스장'), (2, '농구장'), (2, '풋살파크'), (2, '피클볼'),
(3, '학생회관403호'), (3, '학생회관404호'), (3, '학생회관406호'),
(4, '5호관'), (4, '하이테크관'),
(5, '본관 대강당'), (5, '본관 중강당'), (5, '본관 소강당'), (5, '5남 소강당'),
(6, '60주년기념관 로비'), (6, '후문'), (6, '광장'), (6, '음악감상실');

INSERT INTO Facilities (cat2_id, name)
VALUES
-- 인문(1) / facility_id = 1 ~ 5
(1, '인문스터디룸B(5남-032B)'), (1, '인문스터디룸C(5남-032C)'), (1, '인문스터디룸D(5남-032D)'), 
(1, '인문스터디룸E(5남-032E)'), (1, '인문스터디룸F(5남-032F)'),
-- 해동(2) / facility_id = 6 ~ 12
(2, '해동스터디룸A(하-132A)'), (2, '해동스터디룸B(하-132B)'), (2, '해동스터디룸C(하-132C)'),
(2, '해동스터디룸D(하-132D)'), (2, '해동스터디룸E(하-132E)'), (2, '해동스터디룸F(하-132F)'), (2, '해동스터디룸G(하-132G)'),
-- 학생라운지(3) / facility_id = 13
(3, '학생라운지스터디룸(하-021)'),
-- 운동장(4) / facility_id = 14 ~ 16
(4, '운동장(축구장)'), (4, '운동장(다목적구장 1(학군단쪽))'), (4, '운동장(다목적구장 2(5남쪽))'),
-- 테니스장(5) / facility_id = 17 ~ 22
(5, '제1테니스장 3번'), (5, '제1테니스장 4번'), (5, '제1테니스장 5번'),
(5, '제2테니스장 6번'), (5, '제2테니스장 7번'), (5, '제2테니스장 8번'),
-- 농구장(6) / facility_id = 23 ~ 26
(6, '농구장 1면(야구장쪽에서 첫번째)'), (6, '농구장 2면(야구장쪽에서 두번째)'),
(6, '농구장 3면(야구장쪽에서 세번째)'), (6, '농구장 4면(야구장쪽에서 네번째)'),
-- 풋살(7) / facility_id = 27 ~ 28
(7, '인하풋살파크A'), (7, '인하풋살파크D'),
-- 피클볼(8) / facility_id = 29 ~ 33
(8, '피클볼 1코트'), (8, '피클볼 2코트(우레탄)'), (8, '피클볼 3코트'),
(8, '피클볼 4코트'), (8, '피클볼 5코트'),
-- 가무(9, 10, 11) / facility_id = 34 ~ 36
(9, '학생회관403호'), (10, '학생회관404호'), (11, '학생회관406호'),
-- 강의실(12, 13) / facility_id = 37 ~ 44
(12, '5남-101'), (12, '5남-102'), (12, '5남-201'), (12, '5남-202'),
(13, '하-101'), (13, '하-102'), (13, '하-201'), (13, '하-202'),
-- (사용자 요청) / facility_id = 45 ~ 55
(14, '본관 대강당'), (15, '본관 중강당'), (16, '본관 소강당'), (17, '5남 소강당'),
(18, '60주년기념관 1층 로비'), (18, '60주년기념관 2층 로비'),
(19, '후문'), (20, '광장'), (21, '음악감상실');

-- --- Clubs (data.sql) ---
INSERT INTO ClubCategory1 (name)
VALUES 
('중앙동아리'), ('학생회(단과대/전공)'), ('학생자치기구'), 
('소모임(단과대/전공)'), ('소모임(대학원)'), ('기타');

INSERT INTO ClubCategory2 (cat1_id, name)
VALUES
(1, '공연'), (1, '어학'), (1, '연구'), (1, '사회'), (1, '종교'), (1, '전시'), (1, '무예'), (1, '구기'), (1, '레저'), (1, '봉사'),
(2, '공과대학'), (2, '자연과학대학'), (2, '경영대학'), (2, '사범대학'), (2, '사회과학대학'),
(2, '문과대학'), (2, '의과대학'), (2, '예술체육대학'), (2, '미래융합대학'), (2, '바이오시스템융합학부'),
(2, '소프트웨어융합대학'), (2, '간호대학'), (2, '프런티어창의대학'), (2, '국제학부'),
(3, '총학생회'), (3, '총대의원회'), (3, '동아리연합회'), (3, '기록물도서관'), (3, '중앙선거관리위원회'),
(4, '공과대학'), (4, '자연과학대학'), (4, '경영대학'), (4, '사범대학'), (4, '사회과학대학'),
(5, '일반대학원'), (5, '(특수)공학대학원'), (5, '(특수)경영대학원'), (5, '(특수)교육대학원'),
(5, '(특수)정책대학원'), (5, '(특수)상담심리대학원'), (5, '(특수)보건대학원'),
(6, '동문회'), (6, '교내 개인 모임'), (6, '학생사회봉사단 인하랑'), (6, '인하대학교 응원단(ASSESS)'), (6, '중국인유학생회');

INSERT INTO Clubs (cat2_id, name) VALUES
(1, '개로'), (1, '고전기타회'), (1, '극단 봄'), (1, '꼬망스'), (1, '노래사랑'), (1, '인하오케스트라'), (1, '인다배소리'), (1, '인하극예술연구회'), (1, '인하인의 피아노 사랑'), (1, '인하합창단'), (1, '트리키'), (1, '판타스틱스테이션'), (1, '풍물사랑'), (1, 'F.L.EX.'), (1, 'FLAGON'), (1, 'INDKY'), (1, 'POP MUSIC'), (1, '인성'),
(2, '가이아'), (2, '알파카이'), (2, '인하스피치'), (2, 'AIESEC in INHA'), (2, 'A.L.A'), (2, 'AZIT'), (2, 'Open Seasame'), (2, 'TIME 연구회'),
(3, '나래'), (3, '로보트연구회'), (3, '별지기'), (3, '보동보동'), (3, '산하사랑'), (3, '아이디어 뱅크'), (3, 'INCOM'), (3, '인하공방'), (3, '기우회'), (3, '인하로케트연구회'), (3, 'GDGoC'), (3, 'I.C.C'), (3, 'IBAS'), (3, 'UMC'), (3, '.NETers'),
(5, '네비게이토'), (5, 'YWAM 예수전도단'), (5, '민족기독학생회'), (5, '인하대학교 불교학생회'), (5, '인하가톨릭학생회'), (5, '예수전도단'), (5, 'CAM'), (5, 'CCC'), (5, 'CFM 수화찬양동아리'), (5, 'ESF'), (5, 'IVF'), (5, 'JDM'), (5, 'JOY선교회'), (5, 'SFC'),
(7, '검도부'), (7, '바크로바틱소울즈'), (7, 'COMBATE'), (7, '인하대학교 태권도부'), (7, '인하암즈'), (7, '인하유도회'), (7, 'IBF'),
(8, '라품'), (8, '러브올'), (8, '마농'), (8, 'TEN-X'), (8, '비룡'), (8, '셔틀콕'), (8, 'INHA-WICS'), (8, '인하 FC'), (8, '에이스리베로'), (8, 'Inha Teal Dragons(인하 미식축구부)'), (8, '테니스부'),
(9, '인하라이더'), (9, '이카루스'), (9, '탈라리아'), (9, 'SKIN-SCUBA'), (9, '인하대 조정부'), (9, '인하스키부'), (9, '산악부'),(9, '수영부'), (9, '스노우보드동아리'), (9, '블랙보드'), (9, '인하수중탐사반'),
(10, '개구장이'), (10, '대우회/JOA'), (10, '로타랙트'), (10, '멍냥멍냥'), (10, '심성회'), (10, '아름회'), (10, '아해누리'), (10, '용마루'), (10, '인하브로드'), (10, '인하장학회'), (10, '트인'), (10, '파파(P.A.P.A)'), (10, '하룡회'), (10, 'MRA'), (10, 'RCY'),
(11, '공과대학 학생회'), (11, '기계공학과 학생회'), (11, '항공우주공학과 학생회'), (11, '사회인프라공학과 학생회'), (11, '에너지자원공학과 학생회'), (11, '조선해양공학과 학생회'), (11, '산업경영공학과 학생회'), (11, '화학공학과 학생회'), (11, '고분자공학과 학생회'), (11, '환경공학과 학생회'), (11, '공간정보공학과 학생회'), (11, '건축공학과 학생회'), (11, '전기전자공학부 학생회'), (11, '신소재공학과 학생회'), (11, '반도체시스템공학과 학생회'), (11, '이차전지융합학과 학생회'), (11, '융합기술경영학부 학생회'),
(12, '자연과학대학 학생회'), (12, '통계학과 학생회'), (12, '물리학과 학생회'), (12, '수학과 학생회'), (12, '화학과 학생회'), (12, '해양과학과 학생회'), (12, '식품영양학과 학생회'),
(13, '경영대학 학생회'), (13, '경영학과 학생회'), (13, '파이낸스경영학과 학생회'), (13, '아태물류학부 학생회'), (13, '국제통상학과 학생회'),
(14, '사범대학 학생회'), (14, '국어교육과 학생회'), (14, '영어교육과 학생회'), (14, '사회교육과 학생회'), (14, '교육학과 학생회'), (14, '체육교육과 학생회'), (14, '수학교육과 학생회'),
(15, '사회과학대학 학생회'), (15, '행정학과 학생회'), (15, '정치외교학과 학생회'), (15, '미디어커뮤니케이션학과 학생회'), (15, '경제학과 학생회'), (15, '소비자학과 학생회'), (15, '아동심리학과 학생회'), (15, '사회복지학과 학생회'),
(16, '문과대학 학생회'), (16, '일본언어문화학과 학생회'), (16, '문화콘텐츠문화경영학과 학생회'), (16, '사학과 학생회'), (16, '철학과 학생회'), (16, '한국어문학과 학생회'), (16, '중국학과 학생회'), (16, '영미유럽인문융합학부 학생회'),
(17, '의과대학 학생회'), (17, '의예과 학생회'),
(18, '예술체육대학 학생회'), (18, '연극영화학과 학생회'), (18, '조형예술학과 학생회'), (18, '디자인융합학과 학생회'), (18, '스포츠과학과 학생회'), (18, '의류디자인학과 학생회'),
(30, '공과대학 소모임'), (30, '기계공학과 소모임'), (30, '항공우주공학과 소모임'), (30, '사회인프라공학과 소모임'), (30, '에너지자원공학과 소모임'), (30, '조선해양공학과 소모임'), (30, '산업경영공학과 소모임'), (30, '화학공학과 소모임'), (30, '고분자공학과 소모임'), (30, '환경공학과 소모임'), (30, '공간정보공학과 소모임'), (30, '건축공학과 소모임'), (30, '전기전자공학부 소모임'), (30, '신소재공학과 소모임'), (30, '반도체시스템공학과 소모임'), (30, '이차전지융합학과 소모임'), (30, '융합기술경영학부 소모임'),
(31, '자연과학대학 소모임'), (31, '통계학과 소모임'), (31, '물리학과 소모임'), (31, '수학과 소모임'), (31, '화학과 소모임'), (31, '해양과학과 소모임'), (31, '식품영양학과 소모임'),
(32, '경영대학 소모임'), (32, '경영학과 소모임'), (32, '파이낸스경영학과 소모임'), (32, '아태물류학부 소모임'), (32, '국제통상학과 소모임'),
(33, '사범대학 소모임'), (33, '국어교육과 소모임'), (33, '영어교육과 소모임'), (33, '사회교육과 소모임'), (33, '교육학과 소모임'), (33, '체육교육과 소모임'), (33, '수학교육과 소모임'),
(34, '사회과학대학 소모임'), (34, '행정학과 소모임'), (34, '정치외교학과 소모임'), (34, '미디어커뮤니케이션학과 소모임'), (34, '경제학과 소모임'), (34, '소비자학과 소모임'), (34, '아동심리학과 소모임'), (34, '사회복지학과 소모임'),
(25, '총학생회'), (26, '총대의원회'), (27, '동아리연합회'), (28, '기록물도서관'), (29, '중앙선거관리위원회');
-- --- Reservations (시연용 20건 - user_id 수정 완료) ---

-- 6. 사용자(김건우) 변수 설정
SET @user_id = '20211234';
SET @user_name = '김건우';
SET @user_major = '인공지능공학과';
SET @user_phone = '010-1234-5678';
SET @user_email = 'kim.geonwoo@inha.ac.kr';

-- === "김건우" (본인) 신청 내역 (7건) ===

-- 1. [승인] 해동A / 11-10 오전
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(2, 6, '기타', '교내 개인 모임', 'SINSA 인공지능학회', '오전 알고리즘 스터디', 5, '화이트보드 마커 필요', 
 '2025-11-10 09:00:00', '2025-11-10 10:59:00', 'none', '미신청', 'approved', '공과대학 행정실', 'approved', '공과대학 행정실', 
 'confirmed', @user_id, @user_name, @user_major, @user_phone, @user_email, '[자동 승인] 우수 동아리', '2025-10-01 10:00:00');

-- 2. [신청중] 해동A / "11-11" 오후 (냉방)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(2, 6, '기타', '교내 개인 모임', 'SINSA 인공지능학회', '오후 머신러닝 스터디', 8, '빔프로젝터 필요', 
 '2025-11-11 14:00:00', '2025-11-11 15:59:00', 'cool', '기관실', 'pending', '공과대학 행정실', 'pending', '공과대학 행정실', 
 'pending', @user_id, @user_name, @user_major, @user_phone, @user_email, '냉방 승인 대기 중', '2025-10-02 11:00:00');

-- 3. [취소] 해동A / 11-12 (관리자 취소)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(2, 6, '기타', '교내 개인 모임', '개인 스터디', '행사 기획', 1, '', 
 '2025-11-12 09:00:00', '2025-11-12 10:59:00', 'none', '미신청', 'rejected', '공과대학 행정실', 'rejected', '공과대학 행정실', 
 'cancelled', @user_id, @user_name, @user_major, @user_phone, @user_email, '관리자 취소. 사유: 스터디룸은 1인 예약 불가.', '2025-10-07 16:00:00');

-- 4. [승인] 가무연습실 403호
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(2, 34, '중앙동아리', '공연', 'FLAGON', '정기공연 댄스 연습', 15, '스피커 연결 케이블', 
 '2025-11-13 18:00:00', '2025-11-13 19:59:00', 'none', '미신청', 'approved', '학생지원팀', 'approved', '학생지원팀', 
 'confirmed', @user_id, @user_name, @user_major, @user_phone, @user_email, '', '2025-10-17 10:00:00');

-- 5. [신청중] 본관 대강당 (대규모)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(2, 45, '학생자치기구', '총학생회', '총학생회', '2025년 하반기 전체학생대표자회의', 300, '유선마이크 5, 단상, 현수막', 
 '2025-11-20 18:00:00', '2025-11-20 20:59:00', 'heat', '기관실', 'pending', '학생지원팀', 'pending', '학생지원팀', 
 'pending', @user_id, @user_name, @user_major, @user_phone, @user_email, '대규모 행사. 1/2차 및 냉난방 확인 필수', '2025-10-18 11:00:00');

-- 6. [취소] 5남-101 (강의실)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(2, 37, '기타', '교내 개인 모임', '인지공이','팀프로젝트 회의', 10, '빔프로젝터', 
 '2025-11-12 16:00:00', '2025-11-12 17:59:00', 'none', '미신청', 'rejected', '학생지원팀', 'rejected', '학생지원팀', 
 'cancelled', @user_id, @user_name, @user_major, @user_phone, @user_email, '관리자 취소. 사유: 해당 시간 정규 수업(기계공학) 배정됨.', '2025-10-19 12:00:00');

-- 7. [승인] 테니스장 4번
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(2, 18, '중앙동아리', '구기', '테니스부', '개인 연습', 2, '', 
 '2025-11-18 16:00:00', '2025-11-18 17:59:00', 'none', '미신청', 'approved', '학생지원팀', 'approved', '학생지원팀', 
 'confirmed', @user_id, @user_name, @user_major, @user_phone, @user_email, '', '2025-10-27 12:00:00');

-- === '다른 사용자' 신청 내역 (13건) ===

-- 8. [취소] 해동A / 11-10 저녁 (이서연 / user_id = 3)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(3, 6, '기타', '교내 개인 모임', 'AUTONAV', '대학원생 랩미팅', 10, '', 
 '2025-11-10 18:00:00', '2025-11-10 19:59:00', 'none', '미신청', 'pending', '공과대학 행정실', 'pending', '공과대학 행정실', 
 'cancelled', 'P2024001', '이서연', '전자공학과', '010-2222-3333', 's.lee@inha.ac.kr', '일정 변경으로 사용자 본인 취소', '2025-10-03 12:00:00');

-- 9. [승인] 해동A / 11-11 오전 (배성호 / user_id = 9)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(9, 6, '학생회(단과대/전공)', '공과대학', '건축공학과 학생회', '교수님 멘토링', 12, '', 
 '2025-11-11 10:00:00', '2025-11-11 11:59:00', 'none', '미신청', 'approved', '공과대학 행정실', 'approved', '공과대학 행정실', 
 'confirmed', 'P2022002', '배성호', '건축공학과', '010-8888-9999', 'sh.bae@inha.ac.kr', '교수님 확인 완료', '2025-10-04 13:00:00');

-- 10. [승인] 해동A / 11-11 저녁 (박지훈 / user_id = 4)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(4, 6, '중앙동아리', '공연', '인하오케스트라', '파트 연습 (바이올린)', 6, '', 
 '2025-11-11 19:00:00', '2025-11-11 20:59:00', 'heat', '기관실', 'approved', '공과대학 행정실', 'approved', '공과대학 행정실', 
 'confirmed', 'S2023001', '박지훈', '기계공학과', '010-4444-5555', 'jihoon.park@inha.ac.kr', '난방 승인 완료.', '2025-10-05 14:00:00');

-- 11. [신청중] 해동A / 11-13 (최수빈 / user_id = 5)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(5, 6, '학생회(단과대/전공)', '소프트웨어융합대학', '데이터사이언스학과 학생회', '공모전 준비 회의', 10, '', 
 '2025-11-13 10:00:00', '2025-11-13 11:59:00', 'none', '미신청', 'pending', '공과대학 행정실', 'pending', '공과대학 행정실', 
 'pending', '20221001', '최수빈', '데이터사이언스학과', '010-1111-2222', 'subin.choi@inha.ac.kr', '', '2025-10-08 17:00:00');

-- 12. [신청중] 해동A / 11-14 (박지훈 / user_id = 4)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(4, 6, '소모임(단과대/전공)', '공과대학', '기계공학과 소모임', '유체역학 텀프로젝트', 6, '화이트보드', 
 '2025-11-14 14:00:00', '2025-11-14 15:59:00', 'none', '미신청', 'pending', '공과대학 행정실', 'pending', '공과대학 행정실', 
 'pending', 'S2023001', '박지훈', '기계공학과', '010-4444-5555', 'jihoon.park@inha.ac.kr', '', '2025-10-11 12:00:00');

-- 13. [취소] 해동A / 11-16 (최수빈 / user_id = 5)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(5, 6, '학생회(단과대/전공)', '소프트웨어융합대학', '컴퓨터공학과 학생회', '기획부 회의', 12, '', 
 '2025-11-16 10:00:00', '2025-11-16 11:59:00', 'none', '미신청', 'pending', '공과대학 행정실', 'pending', '공과대학 행정실', 
 'cancelled', '20221001', '최수빈', '데이터사이언스학과', '010-1111-2222', 'subin.choi@inha.ac.kr', '사용자 본인 취소', '2025-10-14 15:00:00');

-- 14. [승인] 운동장 (정다은 / user_id = 6)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(6, 14, '학생회(단과대/전공)', '사회과학대학', '경제학과 학생회', '경영대 vs 경제대 친선 축구', 50, '팀 조끼 50개', 
 '2025-11-15 14:00:00', '2025-11-15 15:59:00', 'none', '미신청', 'approved', '학생지원팀', 'approved', '학생지원팀', 
 'confirmed', '20232002', '정다은', '경영학과', '010-3333-4444', 'daeun.jung@inha.ac.kr', '경기 후 쓰레기 정리 필수', '2025-10-15 16:00:00');

-- 15. [승인] 60주년 1층 로비 (박지훈 / user_id = 4)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(4, 52, '학생회(단과대/전공)', '소프트웨어융합대학', '디자인테크놀로지학과 학생회', '졸업작품 전시회', 150, '전시용 패널 10개 설치', 
 '2025-11-15 09:00:00', '2025-11-15 16:59:00', 'none', '미신청', 'approved', '학생지원팀', 'approved', '학생지원팀', 
 'confirmed', 'S2023001', '박지훈', '기계공학과', '010-4444-5555', 'jihoon.park@inha.ac.kr', '소음 발생하지 않도록 유의.', '2025-10-20 13:00:00');

-- 16. [승인] 인문스터디룸C (윤태현 / user_id = 7)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(7, 2, '학생회(단과대/전공)', '문과대학', '철학과 학생회', '철학 세미나', 8, '', 
 '2025-11-14 13:00:00', '2025-11-14 14:59:00', 'none', '미신청', 'approved', '문과대학 행정실', 'approved', '문과대학 행정실', 
 'confirmed', '20203003', '윤태현', '사학과', '010-5555-6666', 'th.yoon@inha.ac.kr', '', '2025-10-21 14:00:00');

-- 17. [신청중] 인문스터디룸D (윤태현 / user_id = 7)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(7, 3, '학생회(단과대/전공)', '문과대학', '사학과 학생회', '역사 토론', 6, '', 
 '2025-11-15 15:00:00', '2025-11-15 16:59:00', 'none', '미신청', 'pending', '문과대학 행정실', 'pending', '문과대학 행정실', 
 'pending', '20203003', '윤태현', '사학과', '010-5555-6666', 'th.yoon@inha.ac.kr', '', '2025-10-22 15:00:00');

-- 18. [승인] 학생라운지 (한유진 / user_id = 8)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(8, 13, '소모임(단과대/전공)', '공과대학', '항공우주공학과 소모임', '캡스톤디자인 회의', 10, 'HDMI 케이블 필요', 
 '2025-11-17 10:00:00', '2025-11-17 11:59:00', 'none', '미신청', 'approved', '공과대학 행정실', 'approved', '공과대학 행정실', 
 'confirmed', '20224004', '한유진', '화학공학과', '010-7777-8888', 'yujin.han@inha.ac.kr', '', '2025-10-24 17:00:00');

-- 19. [승인] 테니스장 3번 (강민재 / user_id = 11)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(11, 17, '중앙동아리', '구기', '테니스부', '정기 연습 (오후)', 4, '', 
 '2025-11-18 14:00:00', '2025-11-18 15:59:00', 'none', '미신청', 'approved', '학생지원팀', 'approved', '학생지원팀', 
 'confirmed', '20235005', '강민재', '체육교육과', '010-0000-1111', 'mj.kang@inha.ac.kr', '', '2025-10-26 11:00:00');

-- 20. [승인] 가무연습실 404호 (박지훈 / user_id = 4)
INSERT INTO Reservations
(user_id, facility_id, org_cat1, org_cat2, group_name, event_name, event_headcount, message, 
 start_time, end_time, hvac_mode, hvac_dept, approval_1, approval_1_dept, approval_2, approval_2_dept, 
 status, submitter_id, submitter_name, submitter_major, submitter_phone, submitter_email, admin_memo, created_at)
VALUES 
(4, 35, '중앙동아리', '공연', 'F.L.EX.', '힙합 댄스 연습', 20, '대형 스피커 1대', 
 '2025-11-19 18:00:00', '2025-11-19 19:59:00', 'cool', '기관실', 'approved', '학생지원팀', 'approved', '학생지원팀', 
 'confirmed', 'S2023001', '박지훈', '기계공학과', '010-4444-5555', 'jihoon.park@inha.ac.kr', '냉방 승인. 소음 민원 주의.', '2025-10-28 13:00:00');


-- 9. 'Safe Update Mode'를 다시 활성화 (권장)
SET SQL_SAFE_UPDATES = 1;