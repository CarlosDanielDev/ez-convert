import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should returns 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.version).toBe("16.0");

  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(typeof responseBody.dependencies.database.max_connections).toBe(
    "number",
  );
  expect(responseBody.dependencies.database.max_connections).toBe(100);

  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toBe(1);

  expect(typeof responseBody.dependencies.database.opened_connections).toBe(
    "number",
  );
});
