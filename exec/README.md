## Version

| **Name** | **Version** |
| --- | --- |
| Node.js | 20.15.0 |
| Java | Open JDK-17 |
| React | 18.3.1 |
| Typescript | ~5.6.3 |
| Spring Boot | 3.3.5 |
| Vite | 5.4.11 |
| IntelliJ | 2024.1.5(Ultimate) |
| VS Code | 1.90.2 |
| MySQL | 8.0.40 |
| MongoDB | 8.0.3 |

## EC2 setup

1. docker & docker compose install
    
    ```bash
    sudo apt update && sudo apt upgrade
    curl -fsSL https://get.docker.com -o dockerSetter.sh
    chmod 711 dockerSetter.sh
    ./dockerSetter.sh
    docker -v
    docker compose version
    ```
    
2. project pull
    
    ```bash
    cd ~/
    sudo git clone https://lab.ssafy.com/s11-final/S11P31E203.git
    ```
    
3. Jenkins deploy & setup
    
    ```bash
    cd ~/{project_directory}/infra/jenkins
    sudo docker compose up -d
    ```
    
4. MySQL deploy
    
    ```bash
    cd ~/{project_directory}/infra/mysql
    MYSQL_ROOT_PASSWORD='<root password>' MYSQL_USER='<user name>' MYSQL_PASSWORD='<user password>' sudo docker compose up -d
    ```
    
5. Mongo DB deploy
    
    ```bash
    cd ~/{project_directory}/infra/mongo
    MONGO_INITDB_ROOT_USERNAME='<user name>' MONGO_INITDB_ROOT_PASSWORD='<password>' sudo docker compose up -d
    ```
    
6. WAS deploy
    
    ```bash
    cd ~/{project_directory}/infra/spring-boot
    JASYPT_ENCRYPTOR_PASSWORD='<encrypt key>' sudo docker compose up -d
    ```
    
7. nginx setup
    
    ```bash
    sudo apt install nginx
    sudo service start nginx
    ```
    
8. React build
    
    ```bash
    cd ~/{project_directory}/client/
    sudo npm i
    sudo npm run build
    sudo cp -r ~/{project_directory}/client/dist/* {nginx_directory}/
    ```
    

### WAS Config

```yaml
server:
  ## SSL 설정
  ssl:
    key-store: classpath:ssl/keystore.p12
    key-store-password: <password>
    key-store-type: PKCS12

spring:
  ## 기본 설정
  application:
    name: server

  ## Jackson 설정
  jackson:
    time-zone: Asia/Seoul

  ## 서블릿 설정
  servlet:
    multipart:
      enabled: true
      max-file-size: 100MB
      max-request-size: 100MB
  
  ## MySQL 설정
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: <user-name>
    password: <password>
    url: <url>
  
  ## MongoDB 설정
  data:
    mongodb:
      host: <url>
      port: 27017
      authentication-database: <database-name>
      username: <user-name>
      password: <password>
      database: <database-name>

  ## JPA 설정
  jpa:
    hibernate:
      ddl-auto: update
  
  ## JWT 설정
  jwt:
    secret: <JWT key>
  
  ## 로깅
  logging:
    level:
      org.springframework.data.mongodb.core.MongoTemplate: DEBUG
  
  ## CLOVA 설정
  naver:
    cloud:
      url: <url>
      secret: <key>

  ## OpenAI 설정
  ai:
    openai:
      api-key: <key>
      chat:
        options:
          model: gpt-4o
          temperature: 0.6
# AWS 설정
cloud:
  aws:
    s3:
      bucket: <bucket-name>
    credentials:
      access-key: <access-key>
      secret-key: <secret-key>
    region:
      static: ap-northeast-2
      auto: false
    stack:
      auto: false
    cloudfront: <cloudfront-url>
```
