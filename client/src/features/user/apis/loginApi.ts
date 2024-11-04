import apiClient from '../../../apis/apiClient';
import {jwtDecode} from 'jwt-decode';
import useUserStore  from '../../../stores/useUserStore';

// 로그인 API 요청 함수
export const login = async (username: string, password: string) => {
  try {
    const response = await apiClient.post('/login', { username, password });
    const { token } = response.headers.Authorization;
    console.log(response.headers.getAuthorization)
    console.log(response.headers.Authorization)
    // JWT 토큰 저장
    localStorage.setItem('token', token);

    // JWT 토큰 디코딩하여 유저 정보 추출
    const userData = jwtDecode(token);
    console.log(userData)
    // Zustand store에 유저 정보 업데이트
    useUserStore.getState().login(token, {id : '1', name : '탱글대기'});

    return userData;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
