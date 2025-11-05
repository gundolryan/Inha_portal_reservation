// 🎯 contexts/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// (AutoRule 인터페이스는 기존과 동일)
export interface AutoRule {
  id: number;
  type: 'allow' | 'deny';
  targetType: 'submitter' | 'facility';
  targetValue: string;
  description: string;
}

type UserType = 'student' | 'admin' | null;

// (AuthContextType 인터페이스는 기존과 동일)
interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  userId: string | null;
  userName: string | null;
  userMajor: string | null;
  autoRules: AutoRule[];
  addRule: (rule: Omit<AutoRule, 'id'>) => void;
  removeRule: (ruleId: number) => void;
  login: (id: string, pw: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// (VALID_USERS 하드코딩 계정 정보는 기존과 동일)
const VALID_USERS: Record<string, { pw: string; type: UserType; name: string; major: string }> = {
  '20211234': { pw: 'student1234', type: 'student', name: '김건우', major: '인공지능공학과' },
  '20212345' : { pw : 'student2345', type: 'student', name: '윤준식', major: '인공지능공학과'}, 
  'admin001': { pw: 'adminpass', type: 'admin', name: '김인하', major: '총무과' }, 
};

// --- [수정됨] 로컬 스토리지 키 정의 ---
const RULES_STORAGE_KEY = 'inha_auto_rules';
const AUTH_STORAGE_KEY = 'inha_auth_state'; // 👈 [NEW] 로그인 상태 저장 키

interface AuthProviderProps {
  children: ReactNode;
}

// --- [NEW] localStorage에 저장할 데이터 타입 정의 ---
interface AuthState {
  isLoggedIn: boolean;
  userType: UserType;
  userId: string | null;
  userName: string | null;
  userMajor: string | null;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // --- [수정됨] useState의 기본값을 'false/null'로 설정 ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userMajor, setUserMajor] = useState<string | null>(null);
  
  const [autoRules, setAutoRules] = useState<AutoRule[]>([]); 

  // --- [수정됨] 페이지 로드 시 localStorage에서 로그인/규칙 상태 복원 ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. 규칙 로드 (기존 로직)
      try {
        const storedRules = window.localStorage.getItem(RULES_STORAGE_KEY);
        if (storedRules) {
          setAutoRules(JSON.parse(storedRules));
        }
      } catch (error) { console.error("AutoRules 로드 오류:", error); }

      // 2. 로그인 상태 로드 (새로고침 문제 해결)
      try {
        const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const authState: AuthState = JSON.parse(storedAuth);
          // 저장된 상태가 '로그인' 상태라면, React 메모리에 복원
          if (authState.isLoggedIn) {
            setIsLoggedIn(true);
            setUserType(authState.userType);
            setUserId(authState.userId);
            setUserName(authState.userName);
            setUserMajor(authState.userMajor);
          }
        }
      } catch (error) { console.error("AuthSate 로드 오류:", error); }
    }
  }, []); // 👈 빈 배열: 페이지 로드 시 1회만 실행

  // (규칙 저장 useEffect는 기존과 동일)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(autoRules));
      } catch (error) { console.error("AutoRules 저장 오류:", error); }
    }
  }, [autoRules]);

  // (addRule, removeRule 함수는 기존과 동일)
  const addRule = (rule: Omit<AutoRule, 'id'>) => {
    setAutoRules(prev => [{ ...rule, id: Date.now() }, ...prev]);
  };
  const removeRule = (ruleId: number) => {
    setAutoRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  // --- [수정됨] 'login' 함수 (localStorage에 저장) ---
  const login = (id: string, pw: string) => {
    const user = VALID_USERS[id];
    
    if (user && user.pw === pw) {
      // 1. React 메모리(useState)에 저장
      setIsLoggedIn(true);
      setUserType(user.type);
      setUserId(id);
      setUserName(user.name);
      setUserMajor(user.major); 
      
      // 2. localStorage에 영구 저장 (새로고침 대비)
      const authState: AuthState = {
        isLoggedIn: true,
        userType: user.type,
        userId: id,
        userName: user.name,
        userMajor: user.major
      };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      
      console.log(`로그인 성공: ${user.type} (${id})`);
      return true;
    }
    
    // (로그인 실패 시)
    logout(); // 👈 localStorage와 React state를 모두 초기화
    return false;
  };

  // --- [수정됨] 'logout' 함수 (localStorage 삭제) ---
  const logout = () => {
    // 1. React 메모리(useState) 초기화
    setIsLoggedIn(false);
    setUserType(null);
    setUserId(null);
    setUserName(null);
    setUserMajor(null);
    
    // 2. localStorage에서 영구 삭제
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const value = {
    isLoggedIn,
    userType,
    userId,
    userName,
    userMajor,
    autoRules,
    addRule,
    removeRule,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// (useAuth 함수는 기존과 동일)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}