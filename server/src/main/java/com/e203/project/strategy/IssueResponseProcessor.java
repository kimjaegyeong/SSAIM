package com.e203.project.strategy;

import com.e203.project.dto.jiraapi.JiraContent;
import com.e203.project.dto.jiraapi.JiraResponse;
import java.util.List;

public class IssueResponseProcessor implements JiraResponseProcessor<JiraResponse, JiraContent> {

    @Override
    public Pagination processResponse(JiraResponse response, List<JiraContent> issues) {
        issues.addAll(response.getIssues());
        return new Pagination(response.getIssues().size(), response.getTotal());
    }
}
