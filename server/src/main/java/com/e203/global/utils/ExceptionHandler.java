package com.e203.global.utils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ExceptionHandler {

    static public void handleException(String message, Exception e) {
        log.error(message, e);
    }
}
