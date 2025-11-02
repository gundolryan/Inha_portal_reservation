// contexts/ReservationContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000/api';

export interface Reservation {
  id: number;
  date: string;
  no: number;
  facility: string;        // 사용단체명
  instructor: string;      // 행사명
  room: string;            // 시설명
  eventDate: string;       // YYYY-MM-DD
  time: string;            // HH:mm
  endTime: string;         // HH:mm
  status: '신청중' | '승인' | '취소';
  dept1: string;
  status1: '미확인' | '확인';
  dept2: string;
  status2: '미확인' | '확인';
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
  eventHeadcount: number;
  hvacUsage: '미사용' | '난방' | '냉방';
  rentalItems: string;
}

export interface NewReservationData {
  facility: string;
  instructor: string;
  room: string;
  eventDate: string;
  time: string;
  endTime: string;
  dept1: string;
  dept2: string;
  hvacCheckDept: string;
  roomCat1: string;
  roomCat2: string;
  roomCat3: string;
  orgName: string;
  orgMiddleCat: string;
  orgDetail: string;
  contact: string;
  emailLocal: string;
  emailDomain: string;
  eventHeadcount: number;
  hvacUsage: '미사용' | '난방' | '냉방';
  rentalItems: string;
}

type BackendReservation = {
  reservation_id: number;
  created_at: string;
  start_time: string;
  end_time: string;
  group_name?: string | null;
  event_name?: string | null;
  approval_1: 'pending'|'approved'|'rejected';
  approval_1_dept?: string | null;
  approval_2: 'pending'|'approved'|'rejected';
  approval_2_dept?: string | null;
  status: 'pending'|'confirmed'|'cancelled';
  hvac_mode: 'none'|'heat'|'cool';
  hvac_dept?: string | null;
  user: { name: string; phone?: string | null };
  facility: { name: string };
};

const toKoStatus = (s: BackendReservation['status']): Reservation['status'] =>
  s === 'confirmed' ? '승인' : s === 'cancelled' ? '취소' : '신청중';

const toEnStatus = (s: Reservation['status']): BackendReservation['status'] =>
  s === '승인' ? 'confirmed' : s === '취소' ? 'cancelled' : 'pending';

const toKoHvac = (m: BackendReservation['hvac_mode']): Reservation['hvacUsage'] =>
  m === 'heat' ? '난방' : m === 'cool' ? '냉방' : '미사용';

const toEnHvac = (m: Reservation['hvacUsage']): BackendReservation['hvac_mode'] =>
  m === '난방' ? 'heat' : m === '냉방' ? 'cool' : 'none';

const mapBackendToFrontend = (b: BackendReservation): Reservation => ({
  id: b.reservation_id,
  date: b.created_at?.split('T')[0] || '',
  no: b.reservation_id,
  facility: b.group_name || '',
  instructor: b.event_name || '',
  room: b.facility?.name || '',
  eventDate: b.start_time?.split('T')[0] || '',
  time: (b.start_time?.split('T')[1] || '').slice(0,5),
  endTime: (b.end_time?.split('T')[1] || '').slice(0,5),
  status: toKoStatus(b.status),
  dept1: b.approval_1_dept || '',
  status1: b.approval_1 === 'approved' ? '확인' : '미확인',
  dept2: b.approval_2_dept || '',
  status2: b.approval_2 === 'approved' ? '확인' : '미확인',
  hvacCheckDept: b.hvac_dept || '',
  hvacStatus: '미신청',
  roomCat1: '',
  roomCat2: '',
  roomCat3: '',
  orgName: '',
  orgMiddleCat: '',
  orgDetail: '',
  contact: b.user?.phone || '',
  emailLocal: '',
  emailDomain: 'inha.ac.kr',
  eventHeadcount: 0,
  hvacUsage: toKoHvac(b.hvac_mode),
  rentalItems: ''
});

interface ReservationContextType {
  reservations: Reservation[];
  fetchReservations: () => Promise<void>;
  addReservation: (newReservation: NewReservationData) => Promise<void>;
  updateReservation: (updated: Reservation) => Promise<void>;
  cancelReservation: (id: number) => Promise<void>;
  batchApprove1: (ids: number[]) => Promise<void>;
  batchApprove2: (ids: number[]) => Promise<void>;
  batchCancel: (ids: number[]) => Promise<void>;
  exportExcel: (p: { startDate?: string; endDate?: string; status?: string }) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    const res = await fetch(`${API_BASE}/reservations`);
    if (!res.ok) throw new Error('fetch failed');
    const data: BackendReservation[] = await res.json();
    setReservations(data.map(mapBackendToFrontend));
  };

  useEffect(() => {
    fetchReservations().catch(console.error);
  }, []);

  const addReservation = async (n: NewReservationData) => {
    // NOTE: facility_id는 실제 존재하는 시설 ID로 바꾸세요.
    const payload = {
      user_id: 1,
      facility_id: 1,
      org_cat1: n.orgName || null,
      org_cat2: n.orgMiddleCat || null,
      group_name: n.facility || null,
      event_name: n.instructor || null,
      event_headcount: Number(n.eventHeadcount) || 0,
      message: n.rentalItems || null,
      start_time: `${n.eventDate}T${n.time}:00`,
      end_time: `${n.eventDate}T${n.endTime}:00`,
      hvac_mode: toEnHvac(n.hvacUsage),
      hvac_dept: n.hvacCheckDept || null,
      approval_1_dept: n.dept1 || null,
      approval_2_dept: n.dept2 || null
    };
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('create failed');
    await fetchReservations();
  };

  const updateReservation = async (u: Reservation) => {
    const payload = {
      status: toEnStatus(u.status),
      status1: u.status1,             // backend에서 status1 -> approval_1 매핑 처리
      status2: u.status2,
      hvac_mode: toEnHvac(u.hvacUsage)
    };
    const res = await fetch(`${API_BASE}/reservations/${u.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('update failed');
    await fetchReservations();
  };

  const cancelReservation = async (id: number) => {
    const res = await fetch(`${API_BASE}/reservations/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' })
    });
    if (!res.ok) throw new Error('cancel failed');
    await fetchReservations();
  };

  const batchApprove1 = async (ids: number[]) => {
    if (!ids.length) return;
    const res = await fetch(`${API_BASE}/reservations/batch-approve-1`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reservation_ids: ids })
    });
    if (!res.ok) throw new Error('batch approve1 failed');
    await fetchReservations();
  };

  const batchApprove2 = async (ids: number[]) => {
    if (!ids.length) return;
    const res = await fetch(`${API_BASE}/reservations/batch-approve-2`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reservation_ids: ids })
    });
    if (!res.ok) throw new Error('batch approve2 failed');
    await fetchReservations();
  };

  const batchCancel = async (ids: number[]) => {
    if (!ids.length) return;
    const res = await fetch(`${API_BASE}/reservations/batch-cancel`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reservation_ids: ids })
    });
    if (!res.ok) throw new Error('batch cancel failed');
    await fetchReservations();
  };

  const exportExcel = ({ startDate, endDate, status }: { startDate?: string; endDate?: string; status?: string; }) => {
    const qs = new URLSearchParams();
    if (startDate) qs.set('startDate', startDate);
    if (endDate) qs.set('endDate', endDate);
    if (status) qs.set('status', status);
    window.open(`${API_BASE}/reservations/export?${qs.toString()}`, '_blank');
  };

  const value: ReservationContextType = {
    reservations,
    fetchReservations,
    addReservation,
    updateReservation,
    cancelReservation,
    batchApprove1,
    batchApprove2,
    batchCancel,
    exportExcel
  };

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
}

export function useReservations() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationProvider');
  return ctx;
}