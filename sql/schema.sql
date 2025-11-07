-- 1. 데이터베이스 완전 삭제 후 새로 생성
DROP DATABASE IF EXISTS inha_reserv;
CREATE DATABASE inha_reserv
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE inha_reserv;

-- 2. 한국 시간대 설정
SET time_zone = '+09:00';

-- --- Roles, Colleges, Departments ---
CREATE TABLE Roles (
    role_id TINYINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) UNIQUE NOT NULL COMMENT '역할명 (student, professor, staff, admin)'
);

CREATE TABLE Colleges (
    college_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL COMMENT '단과대 이름'
);

CREATE TABLE Departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL COMMENT '학과 이름',
    FOREIGN KEY (college_id) REFERENCES Colleges(college_id)
);

-- --- Users ---
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(80) NOT NULL,
    dept_id INT,
    phone VARCHAR(30),
    role_id TINYINT NOT NULL,
    student_id VARCHAR(20) UNIQUE NULL COMMENT '학번',
	password VARCHAR(255) NOT NULL COMMENT '비밀번호 (해시 저장)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_dept FOREIGN KEY (dept_id) REFERENCES Departments(dept_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- --- Facilities ---
CREATE TABLE FacilityCategory1 (
    cat1_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL COMMENT '대분류 (예: 스터디룸, 체육시설, 가무연습실, 강의실)'
);

CREATE TABLE FacilityCategory2 (
    cat2_id INT PRIMARY KEY AUTO_INCREMENT,
    cat1_id INT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '중분류 (예: 해동스터디룸, 운동장 등)',
    CONSTRAINT fk_cat2_cat1 FOREIGN KEY (cat1_id)
        REFERENCES FacilityCategory1(cat1_id)
        ON DELETE CASCADE
);

CREATE TABLE Facilities (
    facility_id INT PRIMARY KEY AUTO_INCREMENT,
    cat2_id INT NOT NULL,
    name VARCHAR(150) NOT NULL COMMENT '시설명 (예: 해동스터디룸A(하-132A))',
    capacity INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fac_cat2 FOREIGN KEY (cat2_id)
        REFERENCES FacilityCategory2(cat2_id)
        ON DELETE CASCADE
);

-- --- Clubs ---
CREATE TABLE ClubCategory1 (
    cat1_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL COMMENT '대분류 (예: 중앙동아리, 학생회(단과대/전공), 학생자치기구 등)'
);

CREATE TABLE ClubCategory2 (
    cat2_id INT PRIMARY KEY AUTO_INCREMENT,
    cat1_id INT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '중분류 (예: 공연, 어학, 공과대학 등)',
    CONSTRAINT fk_club_cat2_cat1 FOREIGN KEY (cat1_id)
        REFERENCES ClubCategory1(cat1_id)
        ON DELETE CASCADE
);

CREATE TABLE Clubs (
    club_id INT PRIMARY KEY AUTO_INCREMENT,
    cat2_id INT NOT NULL,
    name VARCHAR(150) NOT NULL COMMENT '동아리명 (예: 인하오케스트라, 기계공학과 학생회 등)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_club_cat2 FOREIGN KEY (cat2_id)
        REFERENCES ClubCategory2(cat2_id)
        ON DELETE CASCADE
);

-- --- Reservations (모든 컬럼이 통합된 최종 버전) ---
CREATE TABLE Reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    facility_id INT NOT NULL,
    
    -- (add2) 사용단체
    org_cat1 VARCHAR(100) NULL DEFAULT NULL COMMENT '사용단체 대분류',
    org_cat2 VARCHAR(100) NULL DEFAULT NULL COMMENT '사용단체 중분류',
    
    -- (DDL) 기본 정보
    group_name VARCHAR(100),
    event_name VARCHAR(255),
    
    -- (add2) 행사인원
    event_headcount INT NULL DEFAULT 0 COMMENT '행사인원',
    
    -- (DDL) 메시지 및 시간
    message TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    
    -- (DDL) 냉난방
    hvac_mode ENUM('none','heat','cool') DEFAULT 'none' COMMENT '냉난방 모드',
    
    -- (add2) 냉난방 확인부서
    hvac_dept VARCHAR(100) NULL DEFAULT NULL COMMENT '냉난방 확인부서명',
    
    -- (DDL) 승인
    approval_1 ENUM('pending','approved','rejected') DEFAULT 'pending',
    
    -- (add2) 1차 확인부서
    approval_1_dept VARCHAR(100) NULL DEFAULT NULL COMMENT '1차 확인부서명',
    
    -- (DDL) 승인
    approval_2 ENUM('pending','approved','rejected') DEFAULT 'pending',
    
    -- (add2) 2차 확인부서
    approval_2_dept VARCHAR(100) NULL DEFAULT NULL COMMENT '2차 확인부서명',
    
    -- (DDL) 최종 상태
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    
    -- (add2) 신청자 정보
    submitter_id VARCHAR(50) NULL COMMENT '신청자 학번/교번',
    submitter_name VARCHAR(80) NULL COMMENT '신청자 이름',
    submitter_major VARCHAR(100) NULL COMMENT '신청자 소속/학과',
    submitter_phone VARCHAR(50) NULL COMMENT '신청자 연락처',
    submitter_email VARCHAR(150) NULL COMMENT '신청자 이메일',
    
    -- (add2) 관리자 메모
    admin_memo TEXT NULL,
    
    -- (DDL) 타임스탬프
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- (DDL) 외래 키
    CONSTRAINT fk_resv_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_resv_fac FOREIGN KEY (facility_id) REFERENCES Facilities(facility_id) ON DELETE CASCADE,
    
    -- (add1) 시간 제한
    CONSTRAINT chk_time_range CHECK (
        TIME(start_time) BETWEEN '07:00:00' AND '21:50:00'
        AND TIME(end_time) BETWEEN '07:09:00' AND '21:59:00'
    )
);

-- (add1) 인덱스 추가
CREATE INDEX idx_reservation_time ON Reservations(facility_id, start_time, end_time);
CREATE INDEX idx_user_id ON Reservations(user_id);
CREATE INDEX idx_facility_id ON Reservations(facility_id);
CREATE INDEX idx_status ON Reservations(status);