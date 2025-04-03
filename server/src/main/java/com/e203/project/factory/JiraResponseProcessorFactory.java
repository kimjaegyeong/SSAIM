package com.e203.project.factory;

import com.e203.project.dto.jiraapi.JiraResponse;
import com.e203.project.dto.jiraapi.JiraSprintFindIssue;
import com.e203.project.strategy.IssueResponseProcessor;
import com.e203.project.strategy.JiraResponseProcessor;
import com.e203.project.strategy.JiraSprintResponseProcessor;

public class JiraResponseProcessorFactory {
    public static <T, R> JiraResponseProcessor<T,R> getProcessor(Class<T> responseType) {
        if (responseType.equals(JiraSprintFindIssue.class)) {
            return (JiraResponseProcessor<T,R>) new JiraSprintResponseProcessor();
        } else if (responseType.equals(JiraResponse.class)) {
            return (JiraResponseProcessor<T,R>) new IssueResponseProcessor();
        }
        throw new IllegalArgumentException("Unsupported response type: " + responseType.getName());
    }
}
