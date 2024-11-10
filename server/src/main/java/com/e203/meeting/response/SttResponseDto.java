package com.e203.meeting.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // 기본 생성자를 protected로 설정
public class SttResponseDto {
    private String result;
    private String message;
    private String token;
    private String version;
    private Params params;
    private int progress;
    private Map<String, Object> keywords;
    private List<Segment> segments;
    private String text;
    private double confidence;
    private List<Speaker> speakers;
    private List<Object> events;
    private List<Object> eventTypes;

    // @JsonCreator를 사용한 생성자 Jackson 라이브러리에서 JSON을 Java 객체로 역직렬화할 때 사용할 생성자를 지정하는 역할을 합니다.
    @JsonCreator
    protected SttResponseDto(
            @JsonProperty("result") String result,
            @JsonProperty("message") String message,
            @JsonProperty("token") String token,
            @JsonProperty("version") String version,
            @JsonProperty("params") Params params,
            @JsonProperty("progress") int progress,
            @JsonProperty("keywords") Map<String, Object> keywords,
            @JsonProperty("segments") List<Segment> segments,
            @JsonProperty("text") String text,
            @JsonProperty("confidence") double confidence,
            @JsonProperty("speakers") List<Speaker> speakers,
            @JsonProperty("events") List<Object> events,
            @JsonProperty("eventTypes") List<Object> eventTypes
    ) {
        this.result = result;
        this.message = message;
        this.token = token;
        this.version = version;
        this.params = params;
        this.progress = progress;
        this.keywords = keywords;
        this.segments = segments;
        this.text = text;
        this.confidence = confidence;
        this.speakers = speakers;
        this.events = events;
        this.eventTypes = eventTypes;
    }
}
