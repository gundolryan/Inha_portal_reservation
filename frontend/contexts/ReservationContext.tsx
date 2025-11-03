// 🎯 contexts/ReservationContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// --- 1. 프론트엔드 UI가 사용하는 데이터 구조 (새 스키마 반영) ---
export interface Reservation {
  id: number;
  date: string;
  no: number;
  facility: string;
  instructor: string;
  room: string;
  eventDate: string;
  time: string;
  endTime: string;
  status: '신청중' | '승인' | '취소';
  dept1: string;
  status1: string;
  dept2: string;
  status2: string;
  hvacCheckDept: string;
  hvacStatus: string;
  roomCat1: string;
  roomCat2: string;
  roomCat3: string;
  orgName: string;
  orgMiddleCat: string;
  orgDetail: string;
  contact: string;
  emailLocal: string;
  emailDomain: string;
  eventHeadcount: string | number;
  hvacUsage: string;
  rentalItems: string;
  statusBroadcast?: 'Y' | 'N';
  submitterId: string;
  submitterName: string;
  submitterMajor: string; 
  adminMemo: string; // 👈 [NEW] adminMemo 필드 추가
}

// (InhaPortal.tsx의 handleSubmit 기준)
type NewReservationData = Omit<Reservation, 'id' | 'no' | 'adminMemo'> & {
    submitterId: string;
    submitterName: string;
    submitterMajor: string;
};

// --- [수정됨] API 연동을 위한 새 함수들 추가 (관리자용) ---
interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (newReservation: NewReservationData) => Promise<void>; // (async)
  cancelReservation: (reservationId: number) => Promise<void>; // (async)
  updateReservation: (updatedReservation: Reservation) => Promise<void>; // (async)
  
  // (AdminPage.tsx용 함수들)
  batchApprove1: (reservationIds: number[]) => Promise<void>;
  batchCancel: (reservationIds: number[]) => Promise<void>;
  // (AdminPage.tsx의 메모 저장을 위한 함수)
  updateAdminMemo: (reservationId: number, adminMemo: string) => Promise<void>;
  // 👇 [NEW] 2차 일괄 확인
  batchApprove2: (reservationIds: number[]) => Promise<void>;
}

// --- 2. [수정됨] 백엔드(schemas.py)에서 보내주는 데이터 구조 정의 ---
interface BackendUser {
  user_id: number;
  email: string;
  name: string;
  phone: string | null;
}
interface BackendFacilityCategory1 {
  name: string;
}
interface BackendFacilityCategory2 {
  name: string;
  category1: BackendFacilityCategory1;
}
interface BackendFacility {
  facility_id: number;
  name: string;
  capacity: number | null;
  category2: BackendFacilityCategory2;
}
interface BackendReservation {
  reservation_id: number;
  user_id: number;
  facility_id: number;
  
  org_cat1: string | null;
  org_cat2: string | null;
  group_name: string | null;
  event_name: string | null;
  event_headcount: number | null;
  message: string | null;
  start_time: string;
  end_time: string;
  hvac_mode: 'none' | 'heat' | 'cool';
  
  hvac_dept: string | null;
  approval_1: 'pending' | 'approved' | 'rejected';
  approval_1_dept: string | null;
  approval_2: 'pending' | 'approved' | 'rejected';
  approval_2_dept: string | null;
  
  status: 'pending' | 'confirmed' | 'cancelled';

  submitter_id: string | null;
  submitter_name: string | null;
  submitter_major: string | null;
  
  // --- [수정됨] 새 컬럼 2개 추가 ---
  submitter_phone: string | null;
  submitter_email: string | null;

  admin_memo: string | null;
  
  created_at: string;
  updated_at: string;
  
  user: BackendUser;
  facility: BackendFacility;
}

// --- 3. [수정됨] 백엔드 데이터 -> 프론트엔드 데이터 "번역" 함수 ---
const mapBackendToFrontend = (be: BackendReservation, index: number): Reservation => {
  const startDate = new Date(be.start_time);
  const endDate = new Date(be.end_time);
  const createdAt = new Date(be.created_at);
  
  // [수정됨] email을 user.email이 아닌 submitter_email에서 가져옴
  const [emailLocal, emailDomain] = be.submitter_email ? be.submitter_email.split('@') : ['', ''];

  let feStatus: '신청중' | '승인' | '취소' = '신청중';
  if (be.status === 'confirmed') feStatus = '승인';
  if (be.status === 'cancelled') feStatus = '취소';
  
  let feHvacStatus = '미신청';
  if (be.hvac_mode === 'heat' || be.hvac_mode === 'cool') feHvacStatus = '신청';

  return {
    id: be.reservation_id,
    no: index + 1,
    date: createdAt.toISOString().split('T')[0],
    facility: be.group_name || '',
    instructor: be.event_name || '',
    room: be.facility.name,
    eventDate: startDate.toISOString().split('T')[0],
    time: startDate.toTimeString().substring(0, 5),
    endTime: endDate.toTimeString().substring(0, 5),
    status: feStatus,
    status1: be.approval_1 === 'approved' ? '확인' : '미확인',
    status2: be.approval_2 === 'approved' ? '확인' : '미확인',
    hvacStatus: feHvacStatus,
    hvacUsage: be.hvac_mode === 'none' ? '미사용' : (be.hvac_mode === 'heat' ? '난방' : '냉방'),
    
    // [수정됨] 연락처/이메일을 user.phone이 아닌 submitter_phone에서 가져옴
    contact: be.submitter_phone || '', 
    emailLocal: emailLocal || '',
    emailDomain: emailDomain || 'inha.ac.kr',
    
    rentalItems: be.message || '',
    dept1: be.approval_1_dept || '',
    dept2: be.approval_2_dept || '',
    hvacCheckDept: be.hvac_dept || '',
    
    roomCat1: be.facility.category2.category1.name,
    roomCat2: be.facility.category2.name,
    roomCat3: be.facility.name,

    orgName: be.org_cat1 || '',
    orgMiddleCat: be.org_cat2 || '',
    orgDetail: be.group_name || '',
    
    eventHeadcount: be.event_headcount || 0,
    
    submitterId: be.submitter_id || '',
    submitterName: be.submitter_name || '',
    submitterMajor: be.submitter_major || '',
    adminMemo: be.admin_memo || '',

    statusBroadcast: 'N',
  };
};


const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

interface ReservationProviderProps {
  children: ReactNode;
}

// --- [수정됨] 4. API 연동으로 Context Provider 전체 교체 ---
export function ReservationProvider({ children }: ReservationProviderProps) {
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const API_URL = 'http://localhost:8000/api/reservations'; // 백엔드 API 주소

  // --- 5. (교체됨) localStorage -> API (GET) ---
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const backendData: BackendReservation[] = await response.json();
        
        // (핵심) 백엔드 데이터를 프론트엔드 형식으로 "번역"
        const frontendData: Reservation[] = backendData
          .map(mapBackendToFrontend)
          .sort((a, b) => b.id - a.id); // 최신순 정렬 (ID 내림차순)
          
        setReservations(frontendData);
        
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []); // 빈 배열: 마운트 시 1회만 실행

  // --- 6. (교체됨) CRUD 함수들 (API 연동) ---
  const facilityNameToIdMap: Record<string, number> = {
  '인문스터디룸B(5남-032B)': 1,
  '인문스터디룸C(5남-032C)': 2,
  '인문스터디룸D(5남-032D)': 3,
  '인문스터디룸E(5남-032E)': 4,
  '인문스터디룸F(5남-032F)': 5,
  '해동스터디룸A(하-132A)': 6,
  '해동스터디룸B(하-132B)': 7,
  '해동스터디룸C(하-132C)': 8,
  '해동스터디룸D(하-132D)': 9,
  '해동스터디룸E(하-132E)': 10,
  '해동스터디룸F(하-132F)': 11,
  '해동스터디룸G(하-132G)': 12,
  '학생라운지스터디룸(하-021)': 13,
  '운동장(축구장)': 14,
  '운동장(다목적구장 1(학군단쪽))': 15,
  '운동장(다목적구장 2(5남쪽))': 16,
  '제1테니스장 3번': 17,
  '제1테니스장 4번': 18,
  '제1테니스장 5번': 19,
  '제2테니스장 6번': 20,
  '제2테니스장 7번': 21,
  '제2테니스장 8번': 22,
  '농구장 1면(야구장쪽에서 첫번째)': 23,
  '농구장 2면(야구장쪽에서 두번째)': 24,
  '농구장 3면(야구장쪽에서 세번째)': 25,
  '농구장 4면(야구장쪽에서 네번째)': 26,
  '인하풋살파크A': 27,
  '인하풋살파크D': 28,
  '피클볼 1코트': 29,
  '피클볼 2코트(우레탄)': 30,
  '피클볼 3코트': 31,
  '피클볼 4코트': 32,
  '피클볼 5코트': 33,
  '학생회관403호': 34,
  '학생회관404호': 35,
  '학생회관406호': 36,
  '5남-101': 37, '5남-102': 38, '5남-201': 39, '5남-202': 40,
  '하-101': 41, '하-102': 42, '하-201': 43, '하-202': 44,
  };
  const addReservation = async (newReservation: NewReservationData) => {

    // 1. 프론트엔드 폼 데이터 -> 백엔드 API 형식으로 "역-번역"

    // [수정됨] Bug 1: facility_id 하드코딩 제거
    // InhaPortal.tsx에서 보낸 room(시설명)을 ID로 변환
    const facilityName = newReservation.room;
    const facility_id = facilityNameToIdMap[facilityName] || 1; // 맵에서 찾고, 못찾으면 1번(기본)

    // [수정됨] Bug 2: email/contact 매핑
    // InhaPortal.tsx에서 보낸 contact, emailLocal, emailDomain 사용
    const submitter_phone = newReservation.contact;
    const submitter_email = newReservation.emailDomain === '직접입력' 
                            ? newReservation.emailLocal 
                            : `${newReservation.emailLocal}@${newReservation.emailDomain}`;

    const backendCreateData = {
      // 🚨 TODO: 로그인 기능 구현 후 실제 user_id로 변경해야 함
      user_id: 1, 
      facility_id: facility_id, // 👈 [수정됨]

      org_cat1: newReservation.orgName,
      org_cat2: newReservation.orgMiddleCat,
      group_name: newReservation.facility, 
      event_name: newReservation.instructor,
      event_headcount: Number(newReservation.eventHeadcount) || 0,

      message: newReservation.rentalItems,
      start_time: `${newReservation.eventDate}T${newReservation.time}`,
      end_time: `${newReservation.eventDate}T${newReservation.endTime}`,
      hvac_mode: newReservation.hvacUsage === '난방' ? 'heat' : (newReservation.hvacUsage === '냉방' ? 'cool' : 'none'),

      approval_1_dept: newReservation.dept1,
      approval_2_dept: newReservation.dept2,
      hvac_dept: newReservation.hvacCheckDept,

      submitter_id: newReservation.submitterId,
      submitter_name: newReservation.submitterName,
      submitter_major: newReservation.submitterMajor,

      // --- [수정됨] Bug 2: 새 컬럼에 데이터 매핑 ---
      submitter_phone: submitter_phone,
      submitter_email: submitter_email,

      admin_memo: newReservation.adminMemo,

      status: newReservation.status,
      approval_1: newReservation.status1,
      approval_2: newReservation.status2,
    };

    try {
      // 2. POST /api/reservations API 호출
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendCreateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Data:", errorData);
        throw new Error(`새 예약 생성에 실패했습니다: ${errorData.detail || response.statusText}`);
      }

      const savedBackendData: BackendReservation = await response.json();
      const newFrontendData = mapBackendToFrontend(savedBackendData, 0);

      setReservations(prev => {
        const renumberedPrev = prev.map(item => ({ ...item, no: item.no + 1 }));
        newFrontendData.no = 1;
        return [newFrontendData, ...prev];
      });

    } catch (error) {
      console.error("Failed to create reservation:", error);
    }
};

  // (PUT) InhaPortal.tsx의 '신청취소'
  const cancelReservation = async (reservationId: number) => {
    
    // (InhaPortal.tsx에서 이미 confirm 창을 띄움)
    const backendUpdateData = {
      status: '취소' // (DB에서 'cancelled'로 매핑됨)
    };

    try {
      const response = await fetch(`${API_URL}/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendUpdateData),
      });

      if (!response.ok) throw new Error('예약 취소에 실패했습니다.');

      const savedBackendData: BackendReservation = await response.json();
      const updatedFrontendData = mapBackendToFrontend(savedBackendData, 0);

      // (InhaPortal.tsx의 요구사항: 취소한 항목은 화면에서 제거)
      setReservations(prev => 
        prev.map(res => {
          if (res.id === updatedFrontendData.id) {
            return { ...updatedFrontendData, no: res.no }; 
          }
          return res;
        })
      );

    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      // throw error;
    }
  };

  // (PUT) AdminPage.tsx의 '1차/2차/상태' 드롭다운 변경
  const updateReservation = async (updatedReservation: Reservation) => {
    
  const backendUpdateData = {
    status1: updatedReservation.status1, // '확인' or '미확인'
    status2: updatedReservation.status2, // '확인' or '미확인'
    status: updatedReservation.status,   // '신청중', '승인', '취소'
    hvacStatus: updatedReservation.hvacStatus, // 👈 [이 줄을 추가!]
  };

    try {
      const response = await fetch(`${API_URL}/${updatedReservation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendUpdateData),
      });

      if (!response.ok) throw new Error('예약 수정에 실패했습니다.');

      const savedBackendData: BackendReservation = await response.json();
      const updatedFrontendData = mapBackendToFrontend(savedBackendData, 0);

      setReservations(prev => 
        prev.map(res => {
          if (res.id === updatedFrontendData.id) {
            return { ...updatedFrontendData, no: res.no }; 
          }
          return res;
        })
      );

    } catch (error) {
      console.error("Failed to update reservation:", error);
      // throw error;
    }
  };
  
  // --- 7. (신규) AdminPage.tsx용 함수들 ---

  // (PUT) AdminPage.tsx의 '관리자 메모' 저장
  const updateAdminMemo = async (reservationId: number, adminMemo: string) => {
    const backendUpdateData = {
      admin_memo: adminMemo
    };

    try {
      const response = await fetch(`${API_URL}/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendUpdateData),
      });

      if (!response.ok) throw new Error('관리자 메모 저장에 실패했습니다.');

      const savedBackendData: BackendReservation = await response.json();
      const updatedFrontendData = mapBackendToFrontend(savedBackendData, 0);
      
      // UI 즉시 업데이트
      setReservations(prev => 
        prev.map(res => 
          res.id === updatedFrontendData.id 
            ? { ...updatedFrontendData, no: res.no } 
            : res
        )
      );

    } catch (error) {
      console.error("Failed to update admin memo:", error);
    }
  };

  // (POST) AdminPage.tsx의 '일괄 1차 승인'
  const batchApprove1 = async (reservationIds: number[]) => {
    try {
      const response = await fetch(`${API_URL}/batch-approve-1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_ids: reservationIds }),
      });
      if (!response.ok) throw new Error('일괄 1차 승인 실패');

      // (성공) UI 즉시 업데이트
      setReservations(prev =>
        prev.map(res =>
          reservationIds.includes(res.id)
            ? { ...res, status1: '확인' }
            : res
        )
      );
    } catch (error) {
      console.error("Failed to batch approve-1:", error);
    }
  };

  // 👇 [NEW] (POST) AdminPage.tsx의 '일괄 2차 승인'
  const batchApprove2 = async (reservationIds: number[]) => {
    try {
      const response = await fetch(`${API_URL}/batch-approve-2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_ids: reservationIds }),
      });
      if (!response.ok) throw new Error('일괄 2차 승인 실패');

      // (성공) UI 즉시 업데이트
      setReservations(prev =>
        prev.map(res =>
          reservationIds.includes(res.id)
            ? { ...res, status2: '확인' }
            : res
        )
      );
    } catch (error) {
      console.error("Failed to batch approve-2:", error);
    }
  };

  // (POST) AdminPage.tsx의 '일괄 취소'
  const batchCancel = async (reservationIds: number[]) => {
    try {
      const response = await fetch(`${API_URL}/batch-cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_ids: reservationIds }),
      });
      if (!response.ok) throw new Error('일괄 취소 실패');

      // (성공) UI 즉시 업데이트
      setReservations(prev =>
        prev.map(res =>
          reservationIds.includes(res.id)
            ? { ...res, status: '취소' }
            : res
        )
      );
    } catch (error) {
      console.error("Failed to batch cancel:", error);
    }
  };

  // --- 8. (교체됨) Provider 반환값 ---
  
  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  const value: ReservationContextType = {
    reservations,
    addReservation,
    cancelReservation,
    updateReservation,
    batchApprove1,
    batchCancel,
    updateAdminMemo,
    batchApprove2, // 👈 [NEW]
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
}