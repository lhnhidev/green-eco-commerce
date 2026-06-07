# Infrastructure Layer Integration Tests

This project contains integration tests for the `GreenEcoCommerce.Infrastructure` project.

## Strategy
- **Tools**: xUnit, Testcontainers
- **Scope**: Tests focus on testing real infrastructure components such as database repositories, external API clients, or message brokers.
- **Rules**:
  - Use Testcontainers to spin up ephemeral Docker containers (e.g., PostgreSQL, Redis) during tests.
  - Tests may take longer to run due to container spin-up.
