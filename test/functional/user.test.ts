import { expect, it, describe, beforeAll } from "vitest";
import supertest from "supertest";
import { ServerSetup } from "@/server";

describe("Create user", () => {
  let server: ServerSetup;

  beforeAll(async () => {
    server = new ServerSetup();

    await server.init();
  });

  it("Should create a new user", async () => {
    const newUser = {
      username: "John Doe",
      email: "johndoe@email.com",
      password: "123456"
    };

    const response = await supertest(server.getExpress())
      .post("/users")
      .send(newUser);

    expect(response.status).toBe(201);
  });
});
