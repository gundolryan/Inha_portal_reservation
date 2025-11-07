// 🎯 components/RuleModal.tsx (새 파일)
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, AutoRule } from '@/contexts/AuthContext';
import { Trash2 } from 'lucide-react';

interface RuleModalProps {
  onClose: () => void;
}

export default function RuleModal({ onClose }: RuleModalProps) {
  const { autoRules, addRule, removeRule } = useAuth();
  
  const [ruleType, setRuleType] = useState<'allow' | 'deny'>('allow');
  const [targetType, setTargetType] = useState<'submitter' | 'facility' | 'facility_type'>('submitter');
  const [targetValue, setTargetValue] = useState('');
  const [description, setDescription] = useState('');

  const [facilityRules, setFacilityRules] = useState<Record<string, boolean>>({
    '스터디룸': false,
    '체육시설': false,
    '가무연습실': false,
  });

  const handleAddRule = () => {
    if (!targetValue || !description) {
      alert('대상 값과 설명을 입력해주세요.');
      return;
    }

    addRule({
      type: ruleType,
      targetType: targetType,
      targetValue: targetValue.trim(),
      description: description.trim(),
    });

    setTargetValue('');
    setDescription('');
  };

  // 모달이 열릴 때, autoRules에서 'facility_type' 규칙을 읽어와 스위치 상태에 반영
  useEffect(() => {
    const newFacilityRules: Record<string, boolean> = {
      '스터디룸': false,
      '체육시설': false,
      '가무연습실': false,
    };
    
    for (const rule of autoRules) {
      if (rule.targetType === 'facility_type' && rule.type === 'allow') {
        if (rule.targetValue in newFacilityRules) {
          newFacilityRules[rule.targetValue] = true;
        }
      }
    }
    setFacilityRules(newFacilityRules);
  }, [autoRules]); // autoRules가 바뀔 때마다 실행

  // 스위치(체크박스)를 토글할 때 호출될 함수
  const handleFacilityRuleToggle = (facilityType: string, isChecked: boolean) => {
    // 1. UI state 즉시 업데이트
    setFacilityRules(prev => ({ ...prev, [facilityType]: isChecked }));

    // 2. AuthContext의 autoRules 업데이트
    if (isChecked) {
      // [Allow] 규칙 추가
      addRule({
        type: 'allow',
        targetType: 'facility_type',
        targetValue: facilityType,
        description: `[시스템] ${facilityType} 자동 승인`
      });
    } else {
      // [Allow] 규칙 찾아서 삭제
      const ruleToRemove = autoRules.find(
        rule => rule.targetType === 'facility_type' && 
                rule.targetValue === facilityType &&
                rule.type === 'allow'
      );
      if (ruleToRemove) {
        removeRule(ruleToRemove.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">자동 승인/취소 규칙 관리</h2>
          <button onClick={onClose} className="px-4 py-1 border border-white rounded text-sm hover:bg-gray-700"> 닫기 </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* 규칙 추가 폼 */}
            <div className="mb-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
                <h3 className="text-md font-semibold text-blue-800 mb-3">새 규칙 추가</h3>
                <div className="grid grid-cols-6 gap-3 text-sm items-center">
                    
                    {/* 규칙 유형 */}
                    <select value={ruleType} onChange={(e) => setRuleType(e.target.value as 'allow' | 'deny')} className="col-span-1 border border-gray-300 rounded p-1">
                        <option value="allow">자동 승인</option>
                        <option value="deny">자동 거부</option>
                    </select>

                    {/* 대상 유형 */}
                    <select value={targetType} onChange={(e) => setTargetType(e.target.value as 'submitter' | 'facility')} className="col-span-1 border border-gray-300 rounded p-1">
                        <option value="submitter">신청자 (학번/사번)</option>
                        <option value="facility">사용단체 (단체명)</option>
                    </select>
                    <select value={targetType} onChange={(e) => setTargetType(e.target.value as any)} className="col-span-1 border border-gray-300 rounded p-1">
                        <option value="submitter">신청자 (학번/사번)</option>
                        <option value="facility">사용단체 (단체명)</option>
                        <option value="facility_type">시설 분류</option>
                    </select>
                    {/* 대상 값 */}
                    <input 
                        type="text" 
                        value={targetValue} 
                        onChange={(e) => setTargetValue(e.target.value)} 
                        placeholder={targetType === 'submitter' ? "학번/사번 (예: 20211234)" : "단체명 (예: 인공지능공학과 학생회"}
                        className="col-span-2 border border-gray-300 rounded px-2 py-1"
                    />

                    {/* 설명 */}
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="규칙 설명 (예: 시험기간 자유 승인)"
                        className="col-span-2 border border-gray-300 rounded px-2 py-1"
                    />
                    
                    {/* 버튼 */}
                    <div className="col-span-6 text-right">
                        <button onClick={handleAddRule} className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            규칙 추가
                        </button>
                    </div>
                </div>
            </div>
            <div className="mb-6 p-4 border border-green-300 rounded-lg bg-green-50">
                <h3 className="text-md font-semibold text-green-800 mb-3">시설 분류별 자동 승인 (On/Off)</h3>
                <p className="text-xs text-gray-600 mb-3">
                  여기를 켜두면, 교직원의 '자동 거부' 규칙에 걸리지 않는 한 해당 시설의 모든 예약이 자동으로 승인됩니다.
                </p>
                <div className="grid grid-cols-3 gap-3 text-sm items-center">
                  
                  {Object.keys(facilityRules).map((facilityType) => (
                    <label key={facilityType} className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200 cursor-pointer">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={facilityRules[facilityType]}
                        onChange={(e) => handleFacilityRuleToggle(facilityType, e.target.checked)}
                      />
                      <span className="font-medium">{facilityType}</span>
                      {facilityRules[facilityType] ? 
                        (<span className="text-green-600 font-bold">ON</span>) : 
                        (<span className="text-gray-500">OFF</span>)
                      }
                    </label>
                  ))}

                </div>
            </div>
            {/* 현재 규칙 목록 */}
            <h3 className="text-md font-semibold text-gray-800 mb-2">현재 설정된 규칙 ({autoRules.length}개)</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 w-1/12">ID</th>
                            <th className="p-2 w-2/12">유형</th>
                            <th className="p-2 w-2/12">대상</th>
                            <th className="p-2 w-3/12">대상 값</th>
                            <th className="p-2 w-3/12">설명</th>
                            <th className="p-2 w-1/12">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autoRules.map(rule => (
                            <tr key={rule.id} className="border-t hover:bg-gray-50">
                                <td className="p-2 text-center text-gray-500">{rule.id % 1000}</td>
                                <td className={`p-2 text-center font-bold ${rule.type === 'allow' ? 'text-green-600' : 'text-red-600'}`}>
                                    {rule.type === 'allow' ? '자동 승인' : '자동 거부'}
                                </td>
                                <td className="p-2 text-center">{rule.targetType === 'submitter' ? '신청자' : '단체명'}</td>
                                <td className="p-2 text-center font-mono">{rule.targetValue}</td>
                                <td className="p-2">{rule.description}</td>
                                <td className="p-2 text-center">
                                    <button onClick={() => removeRule(rule.id)} className="text-red-500 hover:text-red-700 p-1 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {autoRules.length === 0 && (
                            <tr><td colSpan={6} className="p-4 text-center text-gray-500">설정된 규칙이 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <p className="mt-4 text-xs text-gray-600">※ 규칙이 추가된 대상에 대해 예약이 신청되면, 해당 예약은 '신청중' 단계를 거치지 않고 바로 '승인' 또는 '취소' 상태로 전환됩니다.</p>
        </div>
      </div>
    </div>
  );
}