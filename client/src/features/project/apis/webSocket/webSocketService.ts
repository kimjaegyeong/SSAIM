import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export let stompClient: Stomp.Client | null = null;

export const connectWebSocket = (token: string, onConnect: () => void) => {
  if (stompClient?.connected) return;

  const socket = new SockJS('https://k11e203.p.ssafy.io:8080/ws');
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {
      Authorization: `Bearer ${token}`,
    },
    () => {
      console.log('WebSocket connected');
      onConnect(); // 연결 성공 시 콜백 실행
    },
    (error: any) => {
      console.error('WebSocket connection error:', error);
    }
  );
};

export const sendMessage = (destination: string, content: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.send(destination, {}, JSON.stringify(content));
  } else {
    console.error('Cannot send message: WebSocket is not connected');
  }
};

export const disconnectWebSocket = () => {
  if (stompClient?.connected) {
    stompClient.disconnect(() => {
      console.log('WebSocket disconnected');
    });
  }
};
