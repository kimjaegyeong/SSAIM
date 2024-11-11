package com.e203.global.utils;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatAiService {

    private final ChatClient chatClient;

    public ChatAiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateWeeklyRemind(String message) {

        return chatClient.prompt()
                .system("아래의 내용의 답변을 한글로 해주고 일기 형태로 요약해줘 1일차 2일차 이렇게 구분하지 말고 하나의 이야기처럼 요약해줘")
                .user(message)
                .call()
                .content();
    }

    public String generateMeetingSummary(String message) {

        return chatClient.prompt()
                .system("아래의 내용을 전체 대화의 주제, 나온 의견들, 미래 방향성의 3주제로 나누어서 요약해줘")
                .user(message)
                .call()
                .content();
    }

    public String generateProposal() {
        return null;
    }
}
