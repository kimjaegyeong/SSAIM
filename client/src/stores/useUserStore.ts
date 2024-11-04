// src/stores/userStore.ts

import {create} from 'zustand';

// 상태 인터페이스 정의
interface UserState {
  isLogin: boolean;
  token: string | null;
  user: { id: string; name: string } | null; // 예시로 사용자 정보를 추가했습니다.
  login: (token: string, user: { id: string; name: string }) => void;
  logout: () => void;
}

// zustand로 상태 생성
const useUserStore = create<UserState>((set) => ({
  isLogin: false,
  token: null,
  user: null,

  // 로그인 함수: 토큰과 사용자 정보를 업데이트하고 isLogin 상태를 true로 설정
  login: (token, user) => {
    set({
      isLogin: true,
      token,
      user,
    });
  },

  // 로그아웃 함수: 상태를 초기화하고 isLogin을 false로 설정
  logout: () => {
    set({
      isLogin: false,
      token: null,
      user: null,
    });
  },
}));

export default useUserStore;
