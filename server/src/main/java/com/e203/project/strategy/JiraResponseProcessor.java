package com.e203.project.strategy;

import java.util.List;

public interface JiraResponseProcessor<T, R> {
    Pagination processResponse(T response, List<R> issues);
}
