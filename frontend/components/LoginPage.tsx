// 🎯 components/LoginPage.tsx

'use client';

import React, { useState, FormEvent } from 'react';
// AuthContext에서 로그인 함수를 가져와야 합니다.
import { useAuth } from '@/contexts/AuthContext'; 
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Context의 login 함수를 호출하여 로그인을 시도합니다.
    if (login(id, password)) {
      // 로그인 성공 시 AuthContext에서 상태가 업데이트되며 AppRouter가 페이지를 전환합니다.
    } else {
      setError('로그인 실패: 학번/사번 또는 비밀번호를 확인해주세요.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-300">
        <div className="flex flex-col items-center mb-6">
          <LogIn size={36} className="text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800"> 인하대학교 포털 시설 예약 </h1>
          <p className="text-sm text-gray-500 mt-1"> 학사행정 로그인</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              학번 / 사번
            </label>
            <input
              id="id"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 20211234 또는 admin001"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-150"
          >
            로그인
          </button>
        </form>
        <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
            <p>테스트 계정: 
                <span className="font-bold text-blue-600 ml-2">학생: 20211234/student1234</span> |
                <span className="font-bold text-red-600 ml-2">관리자: admin001/adminpass</span>
            </p>
        </div>
      </div>
    </div>
  );
}