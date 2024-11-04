// src/stores/userStore.ts

import {create} from 'zustand';

// 상태 인터페이스 정의
interface UserState {
  isLogin: boolean;
  token: string | null;
  userId : string| null;
  role : string| null;
  login: (token: string, userId:string, role:string) => void;
  logout: () => void;
}

// zustand로 상태 생성
const useUserStore = create<UserState>((set) => ({
  isLogin: false,
  token: null,
  userId: null,
  role : null,

  // 로그인 함수: 토큰과 사용자 정보를 업데이트하고 isLogin 상태를 true로 설정
  login: (token, userId, role) => {
    set({
      isLogin: true,
      token,
      userId,
      role,
    });
    console.log('login success!', 'userId : ', userId, 'token : ', token, 'role : ', role)
  },

  // 로그아웃 함수: 상태를 초기화하고 isLogin을 false로 설정
  logout: () => {
    set({
      isLogin: false,
      token: null,
      userId: null,
      role : null,
    });
  },
}));

export default useUserStore;
