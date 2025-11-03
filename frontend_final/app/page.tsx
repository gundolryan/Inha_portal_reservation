// 🎯 app/page.tsx

'use client'; 

import React from 'react';
// @/components/ 폴더에 저장된 세 가지 컴포넌트를 불러옵니다. 경로를 확인해주세요.
import InhaPortal from '@/components/InhaPortal'; // (사용자 페이지)
import AdminPage from '@/components/AdminPage';   // (관리자 페이지)
import LoginPage from '@/components/LoginPage';   // (로그인 UI)
// contexts/AuthContext.tsx에서 로그인 상태를 가져오는 훅을 불러옵니다.
import { useAuth } from '@/contexts/AuthContext'; 

// 이 컴포넌트가 웹사이트의 메인 화면(루트 경로 '/')을 결정합니다.
export default function AppRouter() {
  // Context에서 현재 로그인 상태 정보를 가져옵니다.
  const { isLoggedIn, userType, logout, userId } = useAuth();
  
  // 로그인된 사용자에게만 보여줄 로그아웃 버튼과 정보를 컴포넌트로 만듭니다.
  const LogoutButton = () => {
    // 로그인이 안 되어 있으면 버튼을 표시하지 않습니다.
    if (!isLoggedIn) return null; 
    
    return (
      <div className="fixed top-4 right-4 z-[999] text-sm flex items-center gap-3">
          <span className="text-gray-600">
              {userType === 'student' ? '학번' : '사번'}: <strong className="text-blue-700">{userId}</strong> 
              ({userType === 'student' ? '학생' : '관리자'})
          </span>
          <button 
              onClick={logout} 
              className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
          >
              로그아웃
          </button>
      </div>
    );
  };

  // 1. 로그인이 되어 있지 않다면, LoginPage 컴포넌트만 렌더링합니다.
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // 2. 로그인이 되어 있다면, 사용자 유형에 따라 페이지를 분기하여 렌더링합니다.
  return (
    <>
      <LogoutButton /> 

      {/* userType이 'student'일 경우 InhaPortal(사용자 페이지) 렌더링 */}
      {userType === 'student' && <InhaPortal />}

      {/* userType이 'admin'일 경우 AdminPage(관리자 페이지) 렌더링 */}
      {userType === 'admin' && <AdminPage />} 
    </>
  );
}