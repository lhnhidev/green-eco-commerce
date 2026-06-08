# WebAPI Layer Functional Tests

This project contains functional/end-to-end tests for the `GreenEcoCommerce.WebAPI` project.

## Strategy
- **Tools**: xUnit (typically combined with `Microsoft.AspNetCore.Mvc.Testing` WebApplicationFactory).
- **Scope**: Tests focus on HTTP request/response pipeline, controllers, middleware, and routing.
- **Rules**:
  - Test endpoints acting as an HTTP client.
  - Ensure status codes, response payloads, and headers are as expected.
