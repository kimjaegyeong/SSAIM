package com.e203.project.strategy;

import java.util.List;

public interface JiraApiStrategy<T, R> {
    R execute(T request, Class<R> responseType);
}
