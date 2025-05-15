import password from "models/password";
import user from "models/user";
import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With a nonexistent 'username'", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/teste", {
        method: "PATCH",
        body: JSON.stringify({
          email: "aaa",
        }),
      });

      expect(response.status).toBe(404);
    });

    test("With duplicated 'username'", async () => {
      await orchestrator.createUser({
        username: "userresponse1",
      });

      await orchestrator.createUser({
        username: "userresponse2",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/userresponse2",
        {
          method: "PATCH",
          headers: {
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify({
            username: "userresponse1",
          }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(400);

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username already in use",
        action: "Use another username to this operation",
        status_code: 400,
      });
    });
    test("With match 'username'", async () => {
      await orchestrator.createUser({
        username: "userresponse3",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/userresponse3",
        {
          method: "PATCH",
          headers: {
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify({
            username: "useRresponse3",
          }),
        },
      );

      expect(response.status).toBe(200);
    });
    test("With duplicated 'email'", async () => {
      await orchestrator.createUser({
        email: "userResponse4@example.com",
      });

      const createdUser2 = await orchestrator.createUser({
        email: "userResponse5@example.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify({
            email: "userResponse4@example.com",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "E-mail is already in use",
        action: "Use another e-mail to this operation",
        status_code: 400,
      });
    });

    test("With match 'email'", async () => {
      const userResponse = await orchestrator.createUser({
        email: "userResponse6@example.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userResponse.username}`,
        {
          method: "PATCH",
          headers: {
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify({
            email: "userresponse6@example.com",
          }),
        },
      );

      expect(response.status).toBe(200);
    });

    test("With unique 'username'", async () => {
      const createdUser = await orchestrator.createUser({
        username: "uniqueuser1",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueuser1",
        {
          method: "PATCH",
          headers: {
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify({
            username: "uniqueuser6",
          }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueuser6",
        email: createdUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique 'email'", async () => {
      await orchestrator.createUser({
        username: "uniqueuser7",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueuser7",
        {
          method: "PATCH",
          headers: {
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify({
            email: "uniqueuser8@example.com",
          }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueuser7",
        email: "uniqueuser8@example.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new 'password'", async () => {
      const createdUser = await orchestrator.createUser({
        username: "newpassword1",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/newpassword1",
        {
          method: "PATCH",
          headers: {
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify({
            password: "123unique2pass",
          }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "newpassword1",
        email: createdUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      const userInDatabase = await user.findOneByUsername("newpassword1");
      const correctPasswordMatch = await password.compare(
        "123unique2pass",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "1234uniquepass",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
