import { expect, it, describe, beforeAll, beforeEach } from "vitest";
import supertest from "supertest";
import { ServerSetup } from "@/server";
import { UserPrismaDBRepository } from "@/repositories/prisma-user-repository";
import HashService from "@/services/hash";

describe("Create user", () => {
  let server: ServerSetup;

  beforeAll(async () => {
    server = new ServerSetup();

    await server.init();
  });

  const userRepository = new UserPrismaDBRepository();
  beforeEach(async () => {
    await userRepository.deleteAll();
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

    await expect(
      HashService.comparePassword(newUser.password, response.body.password)
    ).resolves.toBeTruthy();

    expect(response.body).toEqual(
      expect.objectContaining({
        ...newUser,
        ...{ password: expect.any(String) }
      })
    );
  });
});
