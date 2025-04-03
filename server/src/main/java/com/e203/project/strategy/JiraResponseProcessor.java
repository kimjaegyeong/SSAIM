package com.e203.project.strategy;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

public interface JiraResponseProcessor<T, R> {
    Class<T> getWrapperType();
    Pagination processResponse(T response, List<R> issues);

    default Pagination deserializeAndProcess(String json, ObjectMapper mapper, List<R> issues) throws Exception {
        T response = mapper.readValue(json, getWrapperType());
        return processResponse(response, issues);
    }
}
