package com.e203.project.strategy;

import lombok.Builder;
import lombok.Getter;

@Getter
public class Pagination {
    private int next;
    private int total;

    @Builder
    public Pagination(int next, int total){
        this.next = next;
        this.total =total;
    }

}
