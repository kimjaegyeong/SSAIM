import apiClient from '../../../apis/apiClient';
import { jwtDecode } from 'jwt-decode';
import useUserStore from '../../../stores/useUserStore';


// JWT 토큰의 디코드된 데이터 구조 정의
interface DecodedToken {
  userId: string;
  role: string;
  // 필요시 추가 필드
}

// 로그인 API 요청 함수
export const login = async (userEmail: string, userPw: string) => {
  try {
    const response = await apiClient.post('/users/login', { userEmail, userPw });
    console.log(response.headers.authorization);
    const token = response.headers.authorization;
    // JWT 토큰 저장
    localStorage.setItem('token', token);

    // JWT 토큰 디코딩하여 유저 정보 추출
    const userData = jwtDecode<DecodedToken>(token);
    console.log(userData);
    // Zustand store에 유저 정보 업데이트
    const { login } = useUserStore.getState();
    login(token, userData.userId, userData.role);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
