package com.e203.project.strategy;

import com.e203.project.factory.JiraResponseProcessorFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class JiraApiFindStrategy implements JiraApiStrategy {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final JiraResponseProcessorFactory processorFactory;

    @Override
    public <R> List<R> execute(Data data, Class<R> elementType) {
        List<R> issues = new ArrayList<>();
        int startAt = 0;
        int maxResults = 100;
        boolean hasMore = true;

        JiraResponseProcessor<?, R> processor = processorFactory.getProcessor(elementType);

        while (hasMore) {
            String jiraUri = Data.JIRA_URL + data.getJql() + data.getFields()
                    + "&startAt=" + startAt + "&maxResults=" + maxResults;
            try {
                String responseBody = getRequestString(jiraUri, data.getKey());
                Pagination pagination = processor.deserializeAndProcess(responseBody, objectMapper, issues);

                if (pagination.getNext() == 0) {
                    break;
                }
                startAt += pagination.getNext();
                hasMore = startAt < pagination.getTotal();
            } catch (Exception e) {
                throw new RuntimeException("Jira API 호출 중 오류 발생 (startAt=" + startAt + ")", e);
            }
        }
        return issues;
    }

    private String getRequestString(String jiraUri, String encodedCredentials) {
        return restClient.get()
                .uri(jiraUri)
                .header("Authorization", "Basic " + encodedCredentials)
                .header("Content-Type", "application/json")
                .retrieve()
                .body(String.class);
    }
}
