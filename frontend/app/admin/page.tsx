// 🎯 app/admin/page.tsx (내용 전체 대체)

import React from 'react';
// 분리된 컴포넌트를 불러옵니다. 경로는 프로젝트 구조에 맞게 수정하세요.
import AdminPage from '@/components/AdminPage'; 

// 이 페이지는 단순히 AdminPage 컴포넌트를 보여주는 역할만 합니다.
export default function AdminIndexPage() {
  return <AdminPage />;
}