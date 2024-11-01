package com.e203.weeklyremind.service;

import com.e203.weeklyremind.request.WeeklyRemindRequestDto;
import com.e203.weeklyremind.response.WeeklyRemindResponseDto;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatAiService {

    private final ChatClient chatClient;

    public ChatAiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateWeeklyRemind(WeeklyRemindRequestDto message, int id) {

        return chatClient.prompt()
                .system("아래의 내용의 답변을 한글로 해주고 일기 형태로 요약해줘 1일차 2일차 이렇게 구분하지 말고 하나의 이야기처럼 요약해줘")
                .user(message.getContent())
                .call()
                .content();
    }
}
