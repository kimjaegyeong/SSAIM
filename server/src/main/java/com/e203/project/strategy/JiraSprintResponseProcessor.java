package com.e203.project.strategy;

import com.e203.project.dto.jiraapi.JiraSprintFindIssue;
import com.e203.project.dto.jiraapi.JiraSprintFindIssueRequest;
import java.util.List;

public class JiraSprintResponseProcessor implements JiraResponseProcessor<JiraSprintFindIssue, JiraSprintFindIssueRequest> {

    @Override
    public Pagination processResponse(JiraSprintFindIssue response, List<JiraSprintFindIssueRequest> issues) {
        issues.addAll(response.getIssues());
        return new Pagination(response.getIssues().size(), response.getTotal());
    }
}
