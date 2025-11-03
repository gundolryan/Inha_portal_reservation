// 🎯 contexts/ReservationContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

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
type NewReservationData = Omit<Reservation, 'id' | 'no' | 'adminMemo'> & {
    submitterId: string;
    submitterName: string;
    submitterMajor: string;
};
interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (newReservation: NewReservationData) => void;
  cancelReservation: (reservationId: number) => void;
  updateReservation: (updatedReservation: Reservation) => void;
}


const ReservationContext = createContext<ReservationContextType | undefined>(undefined);
interface ReservationProviderProps {
  children: ReactNode;
}
const initialSampleData: Reservation[] = [
  {
    id: 1, date: '2025-09-29', no: 62, facility: 'SINSA 인공지능학회', instructor: '핸즈온 머신_러닝 스터디', room: '해동스터디룸A(하-132A)', eventDate: '2025-10-02', time: '19:00', endTime: '20:19', status: '승인',
    dept1: '공과대학 행정실', status1: '확인', dept2: '공과대학 행정실', status2: '확인', hvacCheckDept: '미신청', hvacStatus: '미신청',
    roomCat1: '스터디룸', roomCat2: '해동스터디룸', roomCat3: '해동스터디룸A(하-132A)',
    orgName: '학생자치기구', orgMiddleCat: 'SINSA 인공지능학회', orgDetail: 'SINSA 인공지능학회',
    contact: '010-0000-0001', emailLocal: 'sinsa', emailDomain: 'inha.ac.kr',
    eventHeadcount: '15', hvacUsage: '미사용', rentalItems: '',
    submitterId: '20211234', submitterName: '김건우', submitterMajor: '인공지능공학과', adminMemo: '스터디 목적 확인 완료.', // 👈 [NEW] adminMemo 추가
  },
  {
    id: 2, date: '2025-10-29', no: 63, facility: '학생회관403호', instructor: '영어교육과 학생회', room: '학생회관403호', eventDate: '2025-11-06', time: '07:30', endTime: '08:30', status: '신청중',
    dept1: '학생지원팀', status1: '미확인', dept2: '학생지원팀', status2: '미확인', hvacCheckDept: '미신청', hvacStatus: '미신청',
    roomCat1: '가무연습실', roomCat2: '학생회관403호', roomCat3: '학생회관403호',
    orgName: '학생회(단과대/전공)', orgMiddleCat: '사범대학', orgDetail: '영어교육과 학생회',
    contact: '12345', emailLocal: 'english', emailDomain: 'inha.ac.kr',
    eventHeadcount: '30', hvacUsage: '냉방', rentalItems: '마이크 2개',
    submitterId: '20220001', submitterName: '박영희', submitterMajor: '영어교육과', adminMemo: '',
  },
  {
    id: 3, date: '2025-10-29', no: 64, facility: '운동장', instructor: '친선 축구 경기', room: '운동장(축구장)', eventDate: '2025-11-07', time: '07:10', endTime: '08:50', status: '취소',
    dept1: '학생지원팀', status1: '확인', dept2: '학생지원팀', status2: '미확인', hvacCheckDept: '미신청', hvacStatus: '미신청',
    roomCat1: '체육시설', roomCat2: '운동장', roomCat3: '운동장(축구장)',
    orgName: '중앙동아리', orgMiddleCat: '구기', orgDetail: '인하 FC',
    contact: '010123456789', emailLocal: 'fc', emailDomain: 'naver.com',
    eventHeadcount: '22', hvacUsage: '미사용', rentalItems: '',
    submitterId: '20199999', submitterName: '최민수', submitterMajor: '체육교육과', adminMemo: '코로나 관련 규정으로 취소됨.', // 👈 [NEW] adminMemo 추가
  },
  {
    id: 4, date: '2025-10-29', no: 65, facility: '해동스터디룸A(하-132A)', instructor: '상임위원회의', room: '해동스터디룸A(하-132A)', eventDate: '2025-11-06', time: '12:30', endTime: '13:30', status: '승인',
    dept1: '공과대학 행정실', status1: '확인', dept2: '공과대학 행정실', status2: '확인', hvacCheckDept: '미신청', hvacStatus: '미신청',
    roomCat1: '스터디룸', roomCat2: '해동스터디룸', roomCat3: '해동스터디룸A(하-132A)',
    orgName: '학생자치기구', orgMiddleCat: '총대의원회', orgDetail: '총대의원회',
    contact: '01056789239', emailLocal: 'daewon', emailDomain: 'inha.ac.kr',
    eventHeadcount: '10', hvacUsage: '미사용', rentalItems: '',
    submitterId: '20205555', submitterName: '이하나', submitterMajor: '법학전문대학원', adminMemo: '',
  },
  {
    id: 5, date: '2025-10-29', no: 66, facility: '인문스터디룸B(5남-032B)', instructor: '기계공학과 학생회', room: '인문스터디룸B(5남-032B)', eventDate: '2025-11-12', time: '07:20', endTime: '08:29', status: '취소',
    dept1: '문과대학 행정실', status1: '확인', dept2: '문과대학 행정실', status2: '미확인', hvacCheckDept: '미신청', hvacStatus: '미신청',
    roomCat1: '스터디룸', roomCat2: '인문스터디룸', roomCat3: '인문스터디룸B(5남-032B)',
    orgName: '학생회(단과대/전공)', orgMiddleCat: '공과대학', orgDetail: '기계공학과 학생회',
    contact: '13', emailLocal: 'mech', emailDomain: 'inha.ac.kr',
    eventHeadcount: '13', hvacUsage: '난방', rentalItems: '',
    submitterId: '20231111', submitterName: '강호동', submitterMajor: '기계공학과', adminMemo: '',
  },
];
const STORAGE_KEY = 'inha_reservations';


export function ReservationProvider({ children }: ReservationProviderProps) {
  
  const [reservations, setReservations] = useState<Reservation[]>(initialSampleData);

  
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const storedItems = window.localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setReservations(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("LocalStorage 읽기 오류:", error);
    }
  }, []); 

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (error) {
      console.error("LocalStorage 쓰기 오류:", error);
    }
  }, [reservations]); 

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setReservations(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Storage 이벤트 처리 오류:", error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const addReservation = (newReservation: NewReservationData) => {
    setReservations(prev => {
      const newId = Date.now();
      const newNo = prev.length > 0 ? Math.max(...prev.map(r => r.no)) + 1 : 1;
      const reservationWithId: Reservation = {
          ...newReservation as Reservation,
          id: newId,
          no: newNo,
          adminMemo: '', // 신규 예약 시 메모 필드 초기화
      };
      return [reservationWithId, ...prev];
    });
  };

  const cancelReservation = (reservationId: number) => {
    setReservations(prev => prev.filter(res => res.id !== reservationId));
  };

  const updateReservation = (updatedReservation: Reservation) => {
    setReservations(prev => 
      prev.map(res => {
        if (res.id !== updatedReservation.id) {
          return res;
        }

        const newReservationData = { ...updatedReservation };
        
        if (newReservationData.status !== '취소') {
            const isHvacConfirmed = 
                newReservationData.hvacUsage === '미사용' || 
                (newReservationData.hvacUsage !== '미사용' && newReservationData.hvacStatus === '확인');

            if (newReservationData.status1 === '확인' && 
                newReservationData.status2 === '확인' && 
                isHvacConfirmed) 
            {
                newReservationData.status = '승인';
            } else if (newReservationData.status !== '신청중') {
                 // 승인이 취소되면 '신청중'으로 되돌립니다.
                newReservationData.status = '신청중';
            }
        } else {
            // 취소 상태가 되면 1차, 2차, HVAC 상태를 '미확인'/'미신청'으로 초기화
            newReservationData.status1 = '미확인';
            newReservationData.status2 = '미확인';
            newReservationData.hvacStatus = '미신청';
        }
        
        return newReservationData;
      })
    );
  };

  const value: ReservationContextType = {
    reservations,
    addReservation,
    cancelReservation,
    updateReservation,
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