package com.e203.project.strategy;

import com.e203.global.utils.ExceptionHandler;
import com.e203.project.factory.JiraResponseProcessorFactory;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
@Component
@RequiredArgsConstructor
public class JiraApiFindStrategy<T> implements JiraApiStrategy<Data, T> {
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    @Override
    public T execute(Data data, Class<T> responseType) {
        List<T> issues = new ArrayList<>();
        int startAt = 0;
        int maxResults = 100;
        boolean hasMore = true;

        JiraResponseProcessor processor = JiraResponseProcessorFactory.getProcessor(responseType);

        while (hasMore) {
            String jiraUri = data.getJIRA_URL() + data.getJql() + data.getFields() + "&startAt=" + startAt + "&maxResults=" + maxResults;
            try {
                String responseBody = getRequestString(jiraUri, data.getKey());
                T response = objectMapper.readValue(responseBody, new TypeReference<T>() {});
                Pagination pagination= processor.processResponse(response, issues);

                startAt += pagination.getNext();
                hasMore = startAt < pagination.getTotal();
            } catch (Exception e) {
                ExceptionHandler.handleException("Error occurred while calling Jira API", e);
                break;
            }
        }
        return (T) issues;
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
