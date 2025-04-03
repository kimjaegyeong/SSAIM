package com.e203.project.factory;

import com.e203.project.dto.jiraapi.JiraContent;
import com.e203.project.dto.jiraapi.JiraSprintFindIssueRequest;
import com.e203.project.strategy.IssueResponseProcessor;
import com.e203.project.strategy.JiraResponseProcessor;
import com.e203.project.strategy.JiraSprintResponseProcessor;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;

@Component
public class JiraResponseProcessorFactory {

    private static final Map<Class<?>, Supplier<JiraResponseProcessor<?, ?>>> REGISTRY = new HashMap<>();

    static {
        REGISTRY.put(JiraContent.class, IssueResponseProcessor::new);
        REGISTRY.put(JiraSprintFindIssueRequest.class, JiraSprintResponseProcessor::new);
    }

    @SuppressWarnings("unchecked")
    public <T, R> JiraResponseProcessor<T, R> getProcessor(Class<R> elementType) {
        Supplier<JiraResponseProcessor<?, ?>> supplier = REGISTRY.get(elementType);
        if (supplier == null) {
            throw new IllegalArgumentException("Unsupported element type: " + elementType.getName());
        }
        return (JiraResponseProcessor<T, R>) supplier.get();
    }
}
