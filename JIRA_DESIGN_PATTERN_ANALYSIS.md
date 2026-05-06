# JIRA API 디자인 패턴 분석

## 1. 기존 구현

### 구조 개요

```
project/
├── factory/
│   └── JiraResponseProcessorFactory.java   ← 정적 팩토리
└── strategy/
    ├── JiraApiStrategy.java                 ← 최상위 전략 인터페이스
    ├── JiraApiFindStrategy.java             ← 전략 구현체 (페이지네이션 루프)
    ├── JiraResponseProcessor.java           ← 응답 처리 인터페이스
    ├── IssueResponseProcessor.java          ← JiraResponse 처리 구현체
    ├── JiraSprintResponseProcessor.java     ← JiraSprintFindIssue 처리 구현체
    ├── Data.java                            ← 요청 데이터 객체
    └── Pagination.java                      ← 페이지 상태 객체
```

### 적용 패턴

- **전략 패턴 (Strategy Pattern):** `JiraApiStrategy` 인터페이스를 통해 API 호출 방식을 캡슐화. 현재 `JiraApiFindStrategy` 하나의 구현체 존재.
- **팩토리 패턴 (Factory Pattern):** `JiraResponseProcessorFactory`가 응답 타입(`Class<T>`)을 기반으로 적절한 `JiraResponseProcessor` 구현체를 반환.

### 동작 흐름

```
호출자
  │
  ▼
JiraApiFindStrategy.execute(data, responseType)
  │
  ├─ JiraResponseProcessorFactory.getProcessor(responseType)
  │       └─ if JiraSprintFindIssue → JiraSprintResponseProcessor
  │          if JiraResponse        → IssueResponseProcessor
  │
  └─ while(hasMore) 루프
          ├─ RestClient로 Jira API 호출
          ├─ ObjectMapper로 응답 역직렬화
          ├─ processor.processResponse() → issues 누적 + Pagination 반환
          └─ startAt 갱신 → 다음 페이지 여부 판단
```

### 주요 파일별 역할

| 파일 | 역할 |
|---|---|
| `JiraApiStrategy<T,R>` | 전략 인터페이스. `execute(T request, Class<R> responseType)` 정의 |
| `JiraApiFindStrategy<T>` | Jira API를 페이지네이션으로 반복 호출하는 전략 구현체 |
| `JiraResponseProcessor<T,R>` | 응답 처리 인터페이스. `processResponse()` 정의 |
| `IssueResponseProcessor` | `JiraResponse`에서 `JiraContent` 목록을 추출 |
| `JiraSprintResponseProcessor` | `JiraSprintFindIssue`에서 `JiraSprintFindIssueRequest` 목록을 추출 |
| `JiraResponseProcessorFactory` | 응답 타입 클래스를 기반으로 적절한 Processor 반환 |
| `Data` | JQL, fields, key를 담는 요청 데이터 객체 |
| `Pagination` | 현재 페이지 이슈 수(`next`)와 전체 수(`total`)를 담는 객체 |

---

## 2. 기존 구현의 문제점

### 2-1. 타입 안전성 버그 (심각)

**위치:** `JiraApiFindStrategy.java`

```java
// 문제 1: Raw type 사용 - 제네릭 정보 소실, 컴파일 경고 발생
JiraResponseProcessor processor = JiraResponseProcessorFactory.getProcessor(responseType);

// 문제 2: TypeReference<T>는 런타임에 타입 소거(Type Erasure)로 인해
//         T의 실제 타입을 알 수 없음 → Jackson이 올바른 타입으로 역직렬화 불가
T response = objectMapper.readValue(responseBody, new TypeReference<T>() {});

// 문제 3: 메서드 반환 타입은 T인데 실제로는 List<T>를 반환 → 잘못된 시그니처
return (T) issues;
```

- `TypeReference<T>`는 제네릭 타입이 런타임에 소거되어 Jackson이 실제 타입을 추론할 수 없음.
- 결과적으로 역직렬화가 `LinkedHashMap`으로 되거나 `ClassCastException` 발생 위험.

### 2-2. 무한루프 위험

**위치:** `JiraApiFindStrategy.java`

```java
startAt += pagination.getNext();  // getNext() = 현재 페이지 이슈 수
hasMore = startAt < pagination.getTotal();
```

- API가 빈 배열(`[]`)을 반환하면 `getNext() == 0`이 되어 `startAt`이 증가하지 않음.
- `startAt < total` 조건이 계속 참이 되어 **무한루프** 발생 가능.

### 2-3. Factory의 OCP(개방-폐쇄 원칙) 위반

**위치:** `JiraResponseProcessorFactory.java`

```java
public static <T, R> JiraResponseProcessor<T,R> getProcessor(Class<T> responseType) {
    if (responseType.equals(JiraSprintFindIssue.class)) {
        return (JiraResponseProcessor<T,R>) new JiraSprintResponseProcessor();
    } else if (responseType.equals(JiraResponse.class)) {
        return (JiraResponseProcessor<T,R>) new IssueResponseProcessor();
    }
    throw new IllegalArgumentException("Unsupported response type: " + responseType.getName());
}
```

- 새로운 응답 타입이 추가될 때마다 팩토리 코드 자체를 수정해야 함 → **OCP 위반**.
- `if-else` 체인이 길어질수록 유지보수성 저하.

### 2-4. Spring DI 일관성 부재

- `JiraApiFindStrategy`: `@Component`로 Spring Bean 등록.
- `JiraResponseProcessorFactory`: 순수 정적(static) 클래스로 Spring 컨텍스트 외부에 존재.
- 팩토리 내부에서 새 Processor 인스턴스를 `new`로 생성하므로, 추후 Processor에 의존성 주입이 필요해질 경우 대응 불가.

### 2-5. `Data` 클래스 설계 문제

```java
// 문제 1: JIRA_URL이 static final이 아닌 인스턴스 필드 → 매 인스턴스마다 불필요하게 생성
private final String JIRA_URL = "https://ssafy.atlassian.net/rest";

// 문제 2: Java 네이밍 컨벤션 위반 (SCREAMING_SNAKE_CASE는 상수에만 사용)
public String getJIRA_URL() { ... }  // → getJiraUrl() 이어야 함
```

### 2-6. 예외 처리 미흡

**위치:** `JiraApiFindStrategy.java`

```java
} catch (Exception e) {
    ExceptionHandler.handleException("Error occurred while calling Jira API", e);
    break;  // 예외를 삼키고 빈 리스트(또는 부분 결과) 반환
}
```

- 호출자는 요청이 실패했는지, 부분 성공인지 알 수 없음.
- 예외를 전파하거나, 실패 상태를 명시적으로 표현해야 함.

---

## 3. 개선 방안

### 3-1. 타입 소거 문제 해결

`TypeReference<T>`를 버리고 `Class<T>`를 직접 넘겨 역직렬화:

```java
// Before
T response = objectMapper.readValue(responseBody, new TypeReference<T>() {});

// After
T response = objectMapper.readValue(responseBody, responseType);
```

메서드 시그니처도 실제 반환 타입을 반영하도록 수정:

```java
// Before: 반환 타입이 T인데 실제로는 List<R>을 반환
public T execute(Data data, Class<T> responseType)

// After: 명확하게 List<R>을 반환함을 표현
public <T, R> List<R> execute(Data data, Class<T> responseType)
```

### 3-2. 무한루프 방어 코드 추가

```java
// After
Pagination pagination = processor.processResponse(response, issues);

if (pagination.getNext() == 0) {
    break;  // 빈 페이지 수신 시 루프 탈출
}

startAt += pagination.getNext();
hasMore = startAt < pagination.getTotal();
```

### 3-3. Factory 개선 - Map 기반 등록 방식

`if-else` 체인 대신 `Map`으로 타입과 Processor를 등록하여 OCP 준수:

```java
@Component
public class JiraResponseProcessorFactory {

    private static final Map<Class<?>, Supplier<JiraResponseProcessor<?, ?>>> REGISTRY = new HashMap<>();

    static {
        REGISTRY.put(JiraSprintFindIssue.class, JiraSprintResponseProcessor::new);
        REGISTRY.put(JiraResponse.class, IssueResponseProcessor::new);
    }

    @SuppressWarnings("unchecked")
    public <T, R> JiraResponseProcessor<T, R> getProcessor(Class<T> responseType) {
        Supplier<JiraResponseProcessor<?, ?>> supplier = REGISTRY.get(responseType);
        if (supplier == null) {
            throw new IllegalArgumentException("Unsupported response type: " + responseType.getName());
        }
        return (JiraResponseProcessor<T, R>) supplier.get();
    }
}
```

- 새 타입 추가 시 `REGISTRY`에 한 줄만 추가하면 됨 → OCP 준수.
- `@Component`로 등록하여 Spring DI와 일관성 유지.

### 3-4. `Data` 클래스 수정

```java
public class Data {
    // Before: 인스턴스 필드
    private final String JIRA_URL = "https://ssafy.atlassian.net/rest";

    // After: 상수로 변경
    public static final String JIRA_URL = "https://ssafy.atlassian.net/rest";

    // 메서드명도 컨벤션에 맞게 수정
    // Before: getJIRA_URL()
    // After: 필드가 static이므로 직접 Data.JIRA_URL로 접근
}
```

### 3-5. 예외 처리 개선

```java
// After: 예외를 전파하여 호출자가 인지할 수 있도록
} catch (Exception e) {
    throw new JiraApiException("Jira API 호출 중 오류 발생 (startAt=" + startAt + ")", e);
}
```

또는 부분 결과를 허용하는 경우 로그와 함께 명시적으로 문서화.

---

## 4. 개선 전후 비교

| 항목 | 개선 전 | 개선 후 |
|---|---|---|
| Jackson 역직렬화 | `TypeReference<T>` (타입 소거로 오작동) | `Class<T>` 직접 사용 |
| 반환 타입 | `T`로 선언 후 `List<T>` 반환 (불일치) | `List<R>` 명시 |
| 무한루프 | 빈 페이지 수신 시 무한루프 가능 | `getNext() == 0` 방어 코드 추가 |
| Factory 확장 | `if-else` 추가 필요 (OCP 위반) | `Map` 등록 방식 (OCP 준수) |
| Spring 일관성 | Factory는 static, Strategy는 Bean | 모두 `@Component`로 통일 |
| `Data.JIRA_URL` | 인스턴스 필드 (불필요한 중복 생성) | `static final` 상수 |
| 예외 처리 | 예외 삼킴, 부분 결과 반환 | 예외 전파로 호출자 인지 가능 |
