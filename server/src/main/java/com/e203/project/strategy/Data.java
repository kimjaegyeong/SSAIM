package com.e203.project.strategy;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Data {
    private final String JIRA_URL = "https://ssafy.atlassian.net/rest";
    private String jql;
    private String fields;
    private String key;

    @Builder
    public Data(String jql, String fields, String key){
        this.jql = jql;
        this.fields = fields;
        this.key = key;
    }
}
