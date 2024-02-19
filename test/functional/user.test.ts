import { expect, it, describe, beforeAll } from "vitest";
import supertest from "supertest";
import { ServerSetup } from "@/server";
import { UserPrismaDBRepository } from "@/repositories/prisma-user-repository";
import HashService from "@/services/hash";

describe("Users tests", () => {
  let server: ServerSetup;

  const userRepository = new UserPrismaDBRepository();
  beforeAll(async () => {
    server = new ServerSetup();

    await server.init();
    await userRepository.deleteAll();
  });

  describe("Creating a new user", () => {
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

    it("Should return an error when email is already registered", async () => {
      const newUser = {
        username: "John Doe",
        email: "johndoe@email.com",
        password: "123456"
      };

      const response = await supertest(server.getExpress())
        .post("/users")
        .send(newUser);

      expect(response.status).toBe(409);

      expect(response.body).toEqual(
        expect.objectContaining({
          code: 409,
          message: expect.any(String)
        })
      );
    });
  });
});
