# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build
# Compiles the Quarkus fast-jar using Maven inside the container.
# Railway has no local target/ directory, so the build must happen here.
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and POM first (layer cache: only re-download deps if pom changes)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q --no-transfer-progress

# Copy source and build
COPY src/ src/
RUN ./mvnw package -DskipTests -Dquarkus.profile=prod \
    --no-transfer-progress -q

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Runtime
# Slim JRE image: only copies the Quarkus fast-jar layout from the build stage.
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /deployments

COPY --from=builder /build/target/quarkus-app/lib/           lib/
COPY --from=builder /build/target/quarkus-app/*.jar          ./
COPY --from=builder /build/target/quarkus-app/app/           app/
COPY --from=builder /build/target/quarkus-app/quarkus/       quarkus/

# Tell Quarkus to use the prod profile so it reads the Railway PostgreSQL env vars:
# PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
ENV QUARKUS_PROFILE=prod

EXPOSE 8080

ENTRYPOINT ["java", \
  "-Dquarkus.http.host=0.0.0.0", \
  "-Djava.util.logging.manager=org.jboss.logmanager.LogManager", \
  "-jar", "quarkus-run.jar"]
