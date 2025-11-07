# inha-facility-reservation-system
인하대학교 시설 예약 통합 및 통합 관리 시스템 (FastAPI + React 기반 웹 애플리케이션)

1. 🎯 프로젝트 목적
본 프로젝트는 인하대학교 내의 시설(강의실, 스터디룸, 체육시설 등)을 온라인으로 예약하고 관리할 수 있는 통합 플랫폼입니다. 기존의 복잡한 오프라인/서류 기반 절차와 교직원의 수동 승인 부담을 개선하여, 하나의 포털에서 예약·승인·이용현황 관리가 가능한 지능형 자동화 시스템을 구축하는 것을 목표로 합니다.

2. ✨ 주요 기능
🧑‍🎓 학생 (Student)
간편한 예약 신청: '대/중/소' 3단계 분류를 통한 직관적인 시설 선택
즉각적인 피드백: '자동 승인 규칙'에 따라 예약 즉시 '승인' 또는 '거부' 상태 확인 (기존 '신청중' 대기 문제 해결)
온라인 오프라인 전환: '대강당' 등 특수 시설 예약 시, 오프라인 '기물 파손 동의'를 온라인 체크리스트로 대체
편의 기능: '최근 내역 불러오기' (날짜만 변경), '월별/주별 현황' 모달, '관련부서 연락처' 제공

👩‍💼 관리자 (Admin)
선택 항목 일괄 승인: 관리자가 '신청중' 목록에서 원하는 항목만 체크하여 '1차', '2차', **'최종 승인'**까지 한 번에 처리
다중 자동 승인 규칙 (On/Off):
    시설 분류별 On/Off: 관리자가 '스터디룸', '체육시설' 등 특정 분류 전체의 자동 승인을 켜고 끌 수 있습니다.
    수동 규칙: 특정 '학번/사번' 또는 '학생 단체명'을 기준으로 영구적인 자동 승인/거부 규칙을 설정할 수 있습니다.
통합 관리: 모든 예약을 날짜/상태별로 필터링하며, '엑셀 내보내기'를 지원합니다.

3. ⚙️ 기술 스택
Backend: Python 3.11, FastAPI, SQLAlchemy (ORM)
Frontend: React 18 (Next.js), TypeScript, React Context API, Tailwind CSS
Database: MySQL 8.0
Environment: Docker, Nginx (예정)

4. 🗂️ 프로젝트 구조
inha-facility-reservation-system/
├── backend/
│   ├── .venv/
│   ├── database.py       # DB 세션 및 엔진 설정
│   ├── main.py           # FastAPI 라우터 (API 엔드포인트)
│   ├── models.py         # SQLAlchemy DB 테이블 모델
│   ├── schemas.py        # Pydantic 데이터 검증 스키마
│   └── requirements.txt
├── frontend/
│   ├── components/
│   │   ├── AdminPage.tsx     # 관리자 페이지
│   │   ├── InhaPortal.tsx  # 학생 예약 페이지 (신청 폼)
│   │   └── RuleModal.tsx     # 자동 규칙 관리 모달
│   ├── contexts/
│   │   ├── AuthContext.tsx       # 인증 및 자동 규칙 상태 관리
│   │   └── ReservationContext.tsx # 예약 데이터 상태 관리
│   ├── app/
│   │   ├── admin/page.tsx      # 관리자 페이지 라우트
│   │   └── page.tsx            # 학생 예약 페이지 라우트
│   └── package.json
├── (DB_Setup)/
│   ├── 01_schema.sql       # 1. 테이블 생성 DDL
│   └── 02_data.sql         # 2. 샘플 데이터 DML
└── README.md

5. 🚀 설치 및 실행
1. Database (MySQL)
MySQL 워크벤치 또는 터미널에서 inha_reserv 데이터베이스를 생성합니다. (utf8mb4)
제출 파일에 포함된 01_schema.sql을 실행하여 모든 테이블과 제약조건을 생성합니다.
02_data.sql을 실행하여 샘플 사용자 및 시설 데이터를 삽입합니다.

2. Backend (FastAPI)
Bash
# 1. 백엔드 디렉토리로 이동
cd backend
# 2. 가상환경 생성 및 활성화
python -m venv .venv
source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
# 3. 의존성 설치
pip install -r requirements.txt
# 4. (중요) .env 파일 설정
# .env 파일을 생성하고 DB 접속 정보(MYSQL_URL 등)를 입력합니다.
# 5. 서버 실행
uvicorn main:app --reload
# (서버가 http://localhost:8000 에서 실행됩니다.)


3. Frontend (Next.js)
Bash
# 1. 프론트엔드 디렉토리로 이동
cd frontend
# 2. 의존성 설치
npm install
# 3. 개발 서버 실행
npm run dev
# (서버가 http://localhost:3000 에서 실행됩니다.)

6. 🧪 테스트 방법
학생 [Student]
http://localhost:3000 접속 후 20211234 / student1234 (김건우) 계정으로 로그인합니다.
[수동 승인 테스트] '시설 예약' 탭에서 '행사장소' ➔ '강의실'을 선택하고 '신청' 버튼을 누르면, '상태'가 **'신청중'**으로 등록되는지 확인합니다.

[시설 분류 자동 승인 테스트] '신규' 버튼을 누른 뒤, '행사장소' ➔ '스터디룸'을 선택하고 '신청' 버튼을 누르면, [시설 분류 자동 승인] 규칙에 의해 즉시 '승인' 상태가 되는지 확인합니다.

'신청취소' 버튼 및 '최근 내역' 버튼이 정상 작동하는지 확인합니다.

관리자 (Admin)
http://localhost:3000/admin 접속 후 admin001 / adminpass (김인하) 계정으로 로그인합니다.

[On/Off 스위치 테스트]
'자동 규칙 관리' 버튼을 누릅니다.
'시설 분류별 자동 승인' 탭에서 '스터디룸' 자동 승인을 OFF로 변경(체크 해제)하고 모달을 닫습니다.
다시 학생 계정(김건우)으로 '스터디룸'을 예약하면, 이번에는 '신청중' 상태로 등록되는지 확인합니다.

[선택 일괄 승인 테스트]
'신청중' 상태인 예약 2개 이상을 체크박스로 선택합니다.
'✔️ 선택 일괄 승인' 버튼을 누릅니다.
"총 2건의 예약이 일괄 승인되었습니다." 알림창이 뜨는지 확인합니다.
새로고침 없이도 해당 항목들의 상태가 즉시 **'승인'**으로 변경되는지 확인합니다.

[엑셀 테스트] '엑셀' 버튼을 눌러 reservations_export.xlsx 파일이 정상적으로 다운로드되는지 확인합니다.