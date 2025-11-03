# backend/schemas.py

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

# --- User Schemas (변경 없음) ---
class UserBase(BaseModel):
    user_id: int
    email: str
    name: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True # (orm_mode -> from_attributes)

# --- Facility Schemas (변경 없음) ---
class FacilityCategory1Base(BaseModel):
    name: str
    class Config:
        from_attributes = True

class FacilityCategory2Base(BaseModel):
    name: str
    category1: FacilityCategory1Base
    class Config:
        from_attributes = True

class FacilityBase(BaseModel):
    facility_id: int
    name: str
    capacity: Optional[int] = None
    category2: FacilityCategory2Base
    class Config:
        from_attributes = True
        
# --- Reservation Schemas (대대적 수정) ---

# [수정됨] API로 예약을 '생성'할 때 프론트엔드가 보내는 데이터 (POST)
class ReservationCreate(BaseModel):
    user_id: int
    facility_id: int
    
    org_cat1: Optional[str] = None
    org_cat2: Optional[str] = None
    group_name: Optional[str] = None
    event_name: Optional[str] = None
    event_headcount: Optional[int] = 0
    message: Optional[str] = None
    start_time: datetime
    end_time: datetime
    hvac_mode: Optional[str] = 'none'
    hvac_dept: Optional[str] = None
    approval_1_dept: Optional[str] = None
    approval_2_dept: Optional[str] = None
    
    submitter_id: Optional[str] = None
    submitter_name: Optional[str] = None
    submitter_major: Optional[str] = None
    
    # --- [수정됨] 새 컬럼 2개 추가 ---
    submitter_phone: Optional[str] = None
    submitter_email: Optional[str] = None
    
    admin_memo: Optional[str] = None
    
    status: Optional[str] = 'pending'
    approval_1: Optional[str] = 'pending'
    approval_2: Optional[str] = 'pending'


# [수정됨] API로 예약을 '수정'할 때 프론트엔드가 보내는 데이터 (PUT)
class ReservationUpdate(BaseModel):
    # (관리자 페이지용)
    approval_1: Optional[str] = None 
    approval_2: Optional[str] = None 
    status: Optional[str] = None     
    hvac_mode: Optional[str] = None  
    
    status1: Optional[str] = None 
    status2: Optional[str] = None 
    hvacStatus: Optional[str] = None
    
    # --- [추가됨] 4. 관리자 메모 (AdminPage.tsx용) ---
    admin_memo: Optional[str] = None


# [수정됨] API가 예약을 '조회'해서 프론트엔드에게 응답하는 데이터 (GET)
class Reservation(BaseModel):
    reservation_id: int
    user_id: int
    facility_id: int
    
    org_cat1: Optional[str] = None
    org_cat2: Optional[str] = None
    group_name: Optional[str] = None
    event_name: Optional[str] = None
    event_headcount: Optional[int] = 0
    message: Optional[str] = None
    start_time: datetime
    end_time: datetime
    hvac_mode: str
    
    hvac_dept: Optional[str] = None
    approval_1: str
    approval_1_dept: Optional[str] = None
    approval_2: str
    approval_2_dept: Optional[str] = None
    
    status: str

    submitter_id: Optional[str] = None
    submitter_name: Optional[str] = None
    submitter_major: Optional[str] = None
    
    # --- [수정됨] 새 컬럼 2개 추가 ---
    submitter_phone: Optional[str] = None
    submitter_email: Optional[str] = None
    
    admin_memo: Optional[str] = None
    
    created_at: datetime
    updated_at: datetime
    
    user: UserBase
    facility: FacilityBase

    class Config:
        from_attributes = True

# --- Batch (일괄) 작업용 스키마 (변경 없음) ---
class BatchPayload(BaseModel):
    reservation_ids: List[int]