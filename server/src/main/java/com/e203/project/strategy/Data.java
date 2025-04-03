package com.e203.project.strategy;

import lombok.Builder;
import lombok.Getter;

@Getter
public class Data {
    public static final String JIRA_URL = "https://ssafy.atlassian.net/rest";
    private final String jql;
    private final String fields;
    private final String key;

    @Builder
    public Data(String jql, String fields, String key) {
        this.jql = jql;
        this.fields = fields;
        this.key = key;
    }
}
