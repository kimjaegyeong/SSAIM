// src/api/apiClient.ts

import axios from 'axios';
import config from '../config/config'; // BASE_URL을 가져오기 위해 config.ts 불러오기
import useUserStore from '../stores/userStore.ts'; //
// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: config.BASE_URL, // 환경에 따라 다른 BASE_URL 적용
  timeout: 5000, // 타임아웃을 5초로 설정 (필요에 따라 조정 가능)
});

// 요청 인터셉터 설정 (예: 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 예: zustand 또는 다른 스토리지에서 토큰 가져오기
    const {token} = useUserStore(); // 여기에 토큰을 추가하거나 zustand에서 가져와서 설정
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정 (예: 에러 핸들링)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 예: 토큰 만료 시 로그아웃 처리 등
    if (error.response && error.response.status === 401) {
      // 로그아웃 로직 또는 리다이렉트 등 추가 가능
      console.error('Unauthorized: Redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
