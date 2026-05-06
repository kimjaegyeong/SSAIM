package com.e203.project.strategy;

import java.util.List;

public interface JiraApiStrategy {
    <R> List<R> execute(Data data, Class<R> elementType);
}
