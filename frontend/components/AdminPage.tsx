// 🎯 components/AdminPage.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { useReservations, Reservation } from '@/contexts/ReservationContext';
import { useAuth } from '@/contexts/AuthContext'; 
import RuleModal from '@/components/RuleModal'; 
import { ChangeEvent } from 'react'; // React 이벤트 타입 추가

// AdminPage 컴포넌트 전체 코드를 여기에 포함
export default function AdminPage() {
  const { reservations, updateReservation,batchApprove1,batchCancel,updateAdminMemo, batchApprove2 } = useReservations();
  const { autoRules } = useAuth(); 
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 상단 필터 상태
  const [searchStartDate, setSearchStartDate] = useState('2025-10-01');
  const [searchEndDate, setSearchEndDate] = useState('2025-11-30');
  const [searchStatus, setSearchStatus] = useState('전체');

  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<Reservation | null>(null);
  
  // [NEW] 관리자 메모/메시지 상태 추가 및 취소일 상태 추가
  const [adminMemo, setAdminMemo] = useState(''); 
  const [cancelDate, setCancelDate] = useState(''); 
  const [showRuleModal, setShowRuleModal] = useState(false); 

  // 날짜 포맷팅 헬퍼 함수
  const formatDate = (date: Date) => { // 👈 타입 지정
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  
  const handleSearch = () => {
    const filtered = reservations.filter(res => {
      const eventDate = new Date(res.eventDate);
      const start = new Date(searchStartDate);
      const end = new Date(searchEndDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      const isDateMatch = eventDate >= start && eventDate <= end;
      const isStatusMatch = searchStatus === '전체' || res.status === searchStatus;
      
      return isDateMatch && isStatusMatch;
    });

    setFilteredReservations(filtered);
  };

  useEffect(() => {
    // useCallback을 사용하지 않아도 되므로 의존성 배열에 reservations 추가 (TypeScript 경고 회피)
    handleSearch(); 
  }, [reservations, searchStartDate, searchEndDate, searchStatus]);

  // 선택된 예약이 변경될 때마다 메모와 취소일을 업데이트 (데이터 지속성)
  useEffect(() => {
      if (selectedDetails) {
          // 타입 단언 (as any) 사용으로 AdminMemo 접근 문제 해결
          setAdminMemo((selectedDetails as any).adminMemo || ''); 
          // 취소 상태일 경우 취소일 설정
          setCancelDate(selectedDetails.status === '취소' ? formatDate(new Date()) : '');
      } else {
          setAdminMemo('');
          setCancelDate('');
      }
  }, [selectedDetails]);


  const handleAdminRowClick = (reservation: Reservation) => {
    setSelectedDetails(reservation);
  };
  
  // 메모가 변경될 때마다 Context를 업데이트하는 함수 (실제 저장 로직)
  const handleAdminMemoChange = (e: ChangeEvent<HTMLTextAreaElement>) => { // 👈 타입 지정
      const newMemo = e.target.value;
      setAdminMemo(newMemo);
      if (selectedDetails) {
        // (참고) 메모는 타이핑할 때마다 저장하면 비효율적이므로,
        // AdminPage.tsx의 UI에는 '저장' 버튼이 필요합니다.
        // 우선은 'admin_memo' 필드만 updateReservation을 통해 저장합니다.
        // [수정] updateReservation 대신 updateAdminMemo 호출

        // 🚨 TODO: 잦은 API 호출을 막기 위해 '저장' 버튼을 따로 만들거나, 
        //         '포커스 아웃' 시 저장하는 로직(useRef, onBlur)이 필요합니다.
        //         우선은 임시로 updateAdminMemo를 호출합니다.
        updateAdminMemo(selectedDetails.id, newMemo);

        // 로컬 상태도 업데이트 (Context가 업데이트 해주긴 하지만 중복 실행)
        setSelectedDetails(prev => prev ? ({ ...prev, adminMemo: newMemo }) : null);
    }
};


  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target; // name: 'status1' 또는 'hvacStatus', value: '확인' 등
    if (!selectedDetails) return;

    // 1. 변경된 값을 일단 적용
    let updatedDetails: Reservation = { ...selectedDetails, [name]: value };

    // 2. '신청취소' 드롭다운을 조작한 경우의 로직
    if (name === 'statusApplicationCancel') {
      const isCanceled = value === 'Y';
      updatedDetails.status = isCanceled ? '취소' : (selectedDetails.status === '취소' ? '신청중' : selectedDetails.status);
      updatedDetails.status1 = isCanceled ? '미확인' : updatedDetails.status1;
      updatedDetails.status2 = isCanceled ? '미확인' : updatedDetails.status2;
      
      setCancelDate(isCanceled ? formatDate(new Date()) : '');
    }
    
    // --- [NEW] 3. 자동 승인 로직 (UI 즉시 반응용) ---
    // (단, '신청취소'를 누른 경우는 이 로직을 건너뜀)
    if (name !== 'statusApplicationCancel' && updatedDetails.status !== '취소') {
        
        // 3a. 냉난방 상태 확인 (사용자 요구사항)
        // (hvacStatus: '미신청', '신청', '확인')
        const currentHvacStatus = updatedDetails.hvacStatus;

        let hvacOk = false;
        if (currentHvacStatus === '미신청') {
            hvacOk = true; // (1. 미신청이면 OK)
        } else {
            hvacOk = (currentHvacStatus === '확인'); // (2. 신청했으면 '확인'이어야 OK)
        }

        // 3b. 최종 승인 검사
        if (updatedDetails.status1 === '확인' && 
            updatedDetails.status2 === '확인' && 
            hvacOk) 
        {
            updatedDetails.status = '승인';
        } else if (updatedDetails.status === '승인') {
            // (반대) 승인 상태였는데 조건이 깨지면 ➔ '신청중'
            updatedDetails.status = '신청중';
        }
    }
    // ---------------------------------------------

    // 4. 최종적으로 변경된 'updatedDetails' 객체로 API 호출 및 UI 업데이트
    updateReservation(updatedDetails); // 👈 Context의 updateReservation 호출
    setSelectedDetails(updatedDetails); // 👈 하단 폼 UI 즉시 업데이트
  };

  const handleBulkAction = (action: string) => {
    console.log(`Action: ${action} processed`);
  };
  
  // 공통 CSS 클래스 정의
  const INPUT_READONLY_CLASS = "w-full border border-gray-300 px-2 py-1 text-xs bg-gray-100 rounded";
  const SELECT_STATUS_CLASS = "border border-gray-300 rounded px-1 py-1 text-xs w-20";
  const LABEL_CLASS = "w-[80px] font-medium text-gray-700 flex-shrink-0 text-left mr-2"; // 라벨 너비 고정

  const Row = ({ children }: { children: React.ReactNode }) => ( // 👈 타입 지정
    <div className="flex w-full mb-1">{children}</div>
  );
  
  const Field = ({ label, children, widthClass = "w-1/3" }: { label: string, children: React.ReactNode, widthClass?: string }) => ( // 👈 타입 지정
    <div className={`flex items-center ${widthClass} px-1`}>
      <label className={LABEL_CLASS}>{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col">
      
      {/* 1. 상단 검색/필터 영역 */}
      <div className="bg-white p-3 border border-gray-300 rounded mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="usagePeriod">사용기간:</label>
            <input type="date" id="usagePeriodStart" value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs"/>
            <span>~</span>
            <input type="date" id="usagePeriodEnd" value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs"/>
            <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs ml-2">
              <option>전체</option>
              <option>신청중</option>
              <option>승인</option>
              <option>취소</option>
            </select>
            <button onClick={handleSearch} className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"> 조회 </button>
          </div>
          <div className="flex items-center gap-1 text-sm">
             {/* 👈 [NEW] 규칙 관리 버튼 추가 */}
            <button onClick={() => setShowRuleModal(true)} className="px-2 py-1 bg-green-200 text-green-700 text-xs rounded hover:bg-green-300">
                자동 규칙 관리 ({autoRules.length})
            </button>
            <button onClick={() => handleBulkAction('메세지 발송')} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">일괄 메세지 발송</button>
            
            <button
              onClick={() => {
                if (selectedIds.length === 0) return alert('항목을 먼저 선택하세요.');
                if (window.confirm(`선택된 ${selectedIds.length}개 항목을 '1차 확인' 처리하시겠습니까?`)) {
                  batchApprove1(selectedIds); // 👈 API 함수 호출
                  setSelectedIds([]); // 선택 해제
                }
              }}
              className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded hover:bg-blue-300"
            >
              일괄 확인
              </button>
            {/* 👇 [NEW] 2차 일괄 확인 버튼 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) return alert('항목을 먼저 선택하세요.');
                if (window.confirm(`선택된 ${selectedIds.length}개 항목을 '2차 확인' 처리하시겠습니까?`)) {
                  batchApprove2(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="px-2 py-1 bg-indigo-200 text-indigo-700 text-xs rounded hover:bg-indigo-300"
            >
              2차 일괄 확인
            </button>
            <button 
              onClick={() => {                                                                                
                if (selectedIds.length === 0) return alert('항목을 먼저 선택하세요.');
                if (window.confirm(`선택된 ${selectedIds.length}개 항목을 '취소' 처리하시겠습니까?`)) {
                  batchCancel(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
            >
              일괄 취소
            </button>
            <button 
              onClick={() => {
                const baseUrl = 'http://localhost:8000/api/reservations/export';

    
                const params = new URLSearchParams();
                params.append('startDate', searchStartDate);
                params.append('endDate', searchEndDate);
                params.append('status', searchStatus);

    
                window.open(`${baseUrl}?${params.toString()}`, '_blank');
              }}
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
            >
              엑셀
            </button>
          </div>
        </div>
      </div>

      {/* 2. 검색 결과 표시 영역 (상단 목록) */}
      <div className="bg-white p-3 border border-gray-300 rounded mb-4 text-sm flex-1 flex flex-col overflow-hidden">
        {filteredReservations.length === 0 ? (
          <p className="text-gray-500">조회된 Data가 존재하지 않습니다.</p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-xs text-left table-auto">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="p-2 border-b w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          // 전체 선택
                          setSelectedIds(filteredReservations.map(r => r.id));
                        } else {
                            // 전체 선택 해제
                            setSelectedIds([]);
                          }
                      }}
                    />
                  </th>
                  <th className="p-2 border-b">신청일자</th>
                  <th className="p-2 border-b">사용단체</th>
                  <th className="p-2 border-b">행사명</th>
                  <th className="p-2 border-b">행사장소</th>
                  <th className="p-2 border-b">시작일</th>
                  <th className="p-2 border-b">시작시간</th>
                  <th className="p-2 border-b">1차</th>
                  <th className="p-2 border-b">2차</th>
                  <th className="p-2 border-b">상태</th>
                  <th className="p-2 border-b">연락처</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map(res => (
                  <tr
                    key={res.id}
                    onClick={() => handleAdminRowClick(res)}
                    className={`cursor-pointer hover:bg-blue-50 ${selectedDetails?.id === res.id ? 'bg-blue-100' : ''}`}
                  >
                    <td 
                      className="p-2 border-b text-center"
                      onClick={(e) => e.stopPropagation()} // (중요) 체크박스 클릭 시 행 클릭 방지
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(res.id)} // 👈 선택 상태
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, res.id]);
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== res.id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-2 border-b">{res.date}</td>
                    <td className="p-2 border-b">{res.facility}</td>
                    <td className="p-2 border-b">{res.instructor}</td>
                    <td className="p-2 border-b">{res.room}</td>
                    <td className="p-2 border-b">{res.eventDate}</td>
                    <td className="p-2 border-b">{res.time}</td>
                    <td className="p-2 border-b">{res.status1}</td>
                    <td className="p-2 border-b">{res.status2}</td>
                    <td className="p-2 border-b">{res.status}</td>
                    <td className="p-2 border-b">{res.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. 하단 상세 정보 영역 (폼 레이아웃) */}
      <div className="bg-white p-4 border border-gray-300 rounded flex-shrink-0 text-xs flex">
        
        {/* A. 메인 필드 영역 (75%) */}
        <div className="flex-1 pr-4">
            {/* 1행: 신청일, 기안자, 연락처 */}
            <Row>
                <Field label="신청일">
                    <input type="text" value={selectedDetails ? selectedDetails.date : ''} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
                <Field label="기안자">
                    <input type="text" value={selectedDetails ? `${selectedDetails.submitterMajor} ${selectedDetails.submitterName}` : ''} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
                <Field label="연락처">
                    <input type="text" value={selectedDetails ? selectedDetails.contact : ''} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
            </Row>

            {/* 2행: 사용기간, 사용시간, 대여물품 */}
            <Row>
                <Field label="사용기간" widthClass="w-1/3">
                    <div className="flex items-center gap-1 w-full">
                        <input type="text" value={selectedDetails ? selectedDetails.eventDate : ''} readOnly className="w-1/2 border border-gray-300 rounded px-1 py-1 text-xs bg-gray-100"/>
                        <span>~</span>
                        <input type="text" value={selectedDetails ? selectedDetails.eventDate : ''} readOnly className="w-1/2 border border-gray-300 rounded px-1 py-1 text-xs bg-gray-100"/>
                    </div>
                </Field>
                <Field label="사용시간" widthClass="w-1/3">
                    <div className="flex items-center gap-1 w-full">
                        <input type="text" value={selectedDetails ? selectedDetails.time : ''} readOnly className="w-1/2 border border-gray-300 rounded px-1 py-1 text-xs bg-gray-100"/>
                        <span>~</span>
                        <input type="text" value={selectedDetails ? selectedDetails.endTime : ''} readOnly className="w-1/2 border border-gray-300 rounded px-1 py-1 text-xs bg-gray-100"/>
                    </div>
                </Field>
                <Field label="대여물품">
                    <input type="text" value={selectedDetails ? selectedDetails.rentalItems : ''} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
            </Row>

            {/* 3행: 행사장소, 인원, 기타장소 */}
            <Row>
                <Field label="행사장소">
                    <input type="text" value={selectedDetails ? selectedDetails.room : ''} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
                <Field label="인원">
                    <div className="flex items-center gap-1 w-full">
                         <input type="text" value={selectedDetails ? selectedDetails.eventHeadcount : ''} readOnly className="w-16 border border-gray-300 rounded px-2 py-1 text-xs bg-gray-100 text-right"/>
                        <span className="text-gray-700">명</span>
                    </div>
                </Field>
                <Field label="기타장소">
                    <input type="text" value={""} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
            </Row>
            
            {/* 4행: 단체명, 행사명 */}
            <Row>
                <Field label="단체명" widthClass="w-2/3">
                    <input type="text" value={selectedDetails ? `${selectedDetails.orgName} / ${selectedDetails.orgMiddleCat} / ${selectedDetails.orgDetail}` : ''} readOnly placeholder="단체구분 / 분과 / 세부 단체명" className={INPUT_READONLY_CLASS}/>
                </Field>
                <Field label="행사명" widthClass="w-1/3">
                    <input type="text" value={selectedDetails ? selectedDetails.instructor : ''} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
            </Row>

            {/* 5행: 취소일 및 확인 상태 요약 체크박스 (최종 정리) */}
            <Row>
                <Field label="취소일" widthClass="w-1/3">
                    <input type="text" value={cancelDate} readOnly className={INPUT_READONLY_CLASS}/>
                </Field>
                
                {/* 👈 [MODIFIED] 관리자 입력 라벨 및 불필요한 필드 제거, 체크박스만 남김 */}
                <div className="flex items-center w-2/3 px-1 justify-start space-x-3">
                     {/* 확인 상태 요약 체크박스 */}
                    <div className="flex justify-start items-center text-xs space-x-3">
                         <label><input type="checkbox" checked={selectedDetails?.status1 === '확인'} readOnly className="mr-1"/> 1차확인</label>
                         <label><input type="checkbox" checked={selectedDetails?.status2 === '확인'} readOnly className="mr-1"/> 2차확인</label>
                         <label><input type="checkbox" checked={selectedDetails?.hvacStatus === '확인'} readOnly className="mr-1"/> 냉난방확인</label>
                         <label><input type="checkbox" checked={(selectedDetails as any)?.statusBroadcast === 'Y'} readOnly className="mr-1"/> 방송기자재확인</label>
                     </div>
                </div>
            </Row>
            
             {/* 6행: 관리자 메시지/비고 입력 필드 */}
             <div className="flex w-full px-1 mt-2">
                <label className={LABEL_CLASS} style={{ alignSelf: 'flex-start' }}>관리자 메시지</label>
                <textarea 
                    value={adminMemo} 
                    onChange={handleAdminMemoChange} 
                    rows={3} 
                    disabled={!selectedDetails}
                    placeholder="취소 사유, 비고 등 신청자에게 전달할 내용을 입력하세요."
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs resize-none"
                />
            </div>
            
        </div>
        
        {/* B. 상태 관리 및 확인 영역 (25%) */}
        <div className="w-[25%] border-l border-gray-200 pl-4 flex flex-col space-y-2">
             <div className="flex items-center justify-end gap-2">
                 <span className="w-16 font-medium text-gray-700">1차확인</span>
                 <select name="status1" value={selectedDetails ? selectedDetails.status1 : '미확인'} onChange={handleStatusChange} disabled={!selectedDetails} className={SELECT_STATUS_CLASS}> <option>미확인</option> <option>확인</option> </select>
             </div>
             <div className="flex items-center justify-end gap-2">
                 <span className="w-16 font-medium text-gray-700">2차확인</span>
                 <select name="status2" value={selectedDetails ? selectedDetails.status2 : '미확인'} onChange={handleStatusChange} disabled={!selectedDetails} className={SELECT_STATUS_CLASS}> <option>미확인</option> <option>확인</option> </select>
             </div>
             <div className="flex items-center justify-end gap-2 pt-1">
                 <span className="w-16 font-medium text-gray-700">신청취소</span>
                 <select name="statusApplicationCancel" value={selectedDetails ? (selectedDetails.status === '취소' ? 'Y' : 'N') : 'N'} onChange={handleStatusChange} disabled={!selectedDetails} className={SELECT_STATUS_CLASS}> <option value="N">N</option> <option value="Y">Y</option> </select>
             </div>
             <div className="flex items-center justify-end gap-2">
                 <span className="w-16 font-medium text-gray-700">냉난방확인</span>
                 <select name="hvacStatus" value={selectedDetails ? selectedDetails.hvacStatus : '미신청'} onChange={handleStatusChange} disabled={!selectedDetails} className={SELECT_STATUS_CLASS}> <option>미신청</option> <option>신청</option> <option>확인</option> </select>
             </div>
             <div className="flex items-center justify-end gap-2">
                 <span className="w-16 font-medium text-gray-700">방송기자재</span>
                 <select name="statusBroadcast" value={selectedDetails ? (selectedDetails as any).statusBroadcast || 'N' : 'N'} onChange={handleStatusChange} disabled={!selectedDetails} className={SELECT_STATUS_CLASS}> <option value="N">N</option> <option value="Y">Y</option> </select>
             </div>
        </div>
      </div>
       {/* 👈 [NEW] 규칙 모달 렌더링 */}
      {showRuleModal && <RuleModal onClose={() => setShowRuleModal(false)} />}
    </div>
  );
}