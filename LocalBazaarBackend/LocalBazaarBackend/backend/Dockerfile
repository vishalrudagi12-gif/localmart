# Multi-stage Docker build for LocalBazaar Spring Boot Backend
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace/app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /workspace/app/target/*.jar app.jar

ENV PORT=8081
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
