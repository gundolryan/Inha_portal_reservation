// 🎯 contexts/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 자동 규칙 타입 정의
export interface AutoRule {
  id: number;
  type: 'allow' | 'deny'; // 승인(allow) 또는 거부(deny)
  targetType: 'submitter' | 'facility'; // 신청자(submitter) 또는 단체(facility)
  targetValue: string; // 학번/사번 또는 단체 이름
  description: string; // 규칙 설명
}

// 사용자 정보 타입 정의
type UserType = 'student' | 'admin' | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  userId: string | null;
  userName: string | null;
  userMajor: string | null;
  autoRules: AutoRule[]; // 👈 [NEW] 자동 규칙 목록
  addRule: (rule: Omit<AutoRule, 'id'>) => void; // 👈 [NEW] 규칙 추가 함수
  removeRule: (ruleId: number) => void; // 👈 [NEW] 규칙 삭제 함수
  login: (id: string, pw: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 하드코딩된 계정 정보 (데모용)
const VALID_USERS: Record<string, { pw: string; type: UserType; name: string; major: string }> = {
  '20211234': { pw: 'student1234', type: 'student', name: '김건우', major: '인공지능공학과' },
  '20212345' : { pw : 'student2345', type: 'student', name: '윤준식', major: '인공지능공학과'}, 
  'admin001': { pw: 'adminpass', type: 'admin', name: '김인하', major: '총무과' }, 
};

// 로컬 스토리지 키
const RULES_STORAGE_KEY = 'inha_auto_rules';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userMajor, setUserMajor] = useState<string | null>(null);
  
  // 👈 [NEW] 규칙 상태 초기화 (localStorage에서 로드)
  const [autoRules, setAutoRules] = useState<AutoRule[]>([]); 

  // 규칙 로드 및 저장 useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRules = window.localStorage.getItem(RULES_STORAGE_KEY);
        if (storedRules) {
          setAutoRules(JSON.parse(storedRules));
        }
      } catch (error) {
        console.error("AutoRules LocalStorage 로드 오류:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(autoRules));
      } catch (error) {
        console.error("AutoRules LocalStorage 저장 오류:", error);
      }
    }
  }, [autoRules]);

  // 규칙 추가/제거 함수
  const addRule = (rule: Omit<AutoRule, 'id'>) => {
    setAutoRules(prev => [{ ...rule, id: Date.now() }, ...prev]);
  };

  const removeRule = (ruleId: number) => {
    setAutoRules(prev => prev.filter(rule => rule.id !== ruleId));
  };


  const login = (id: string, pw: string) => {
    const user = VALID_USERS[id];
    
    if (user && user.pw === pw) {
      setIsLoggedIn(true);
      setUserType(user.type);
      setUserId(id);
      setUserName(user.name);
      setUserMajor(user.major); 
      console.log(`로그인 성공: ${user.type} (${id})`);
      return true;
    }
    
    setIsLoggedIn(false);
    setUserType(null);
    setUserId(null);
    setUserName(null);
    setUserMajor(null); 
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserId(null);
    setUserName(null);
    setUserMajor(null);
  };

  const value = {
    isLoggedIn,
    userType,
    userId,
    userName,
    userMajor,
    autoRules, // 👈 [NEW] Context 값에 포함
    addRule, // 👈 [NEW] Context 값에 포함
    removeRule, // 👈 [NEW] Context 값에 포함
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}