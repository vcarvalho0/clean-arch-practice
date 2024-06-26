import request from "supertest";
import HashService from "@/services/hash";
import AuthService from "@/services/jwt";
import { expect, it, describe, beforeAll } from "vitest";
import { ServerSetup } from "@/server";
import { UserPrismaDBRepository } from "@/repositories/prisma/prisma-user-repository";

describe("Users tests", () => {
  const userRepository = new UserPrismaDBRepository();

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

    const response = await request(server.getExpress())
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

  it("Should return 409 when email is already registered", async () => {
    const newUser = {
      username: "John Doe",
      email: "johndoe@email.com",
      password: "123456"
    };

    const response = await request(server.getExpress())
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

  it("Should return 401 when user doesn't exist in database", async () => {
    const user = {
      email: "johndoe2@email.com",
      password: "123456"
    };

    const response = await request(server.getExpress())
      .post("/users/authenticate")
      .send(user);

    expect(response.status).toBe(401);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: 401,
        message: "User not found"
      })
    );
  });

  it("Should return 401 when user password doesn't match", async () => {
    const user = {
      email: "johndoe@email.com",
      password: "123"
    };

    const response = await request(server.getExpress())
      .post("/users/authenticate")
      .send(user);

    expect(response.status).toBe(401);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: 401,
        message: "Email or password doesn't exist"
      })
    );
  });

  it("Should generate a token and return 200", async () => {
    await userRepository.deleteAll();
    const hashPass = await HashService.hashPassword("123456");

    const newUser = {
      username: "John Doe",
      email: "johndoe@email.com",
      password: hashPass
    };

    const user = await userRepository.create(newUser);
    const response = await request(server.getExpress())
      .post("/users/authenticate")
      .send({ email: newUser.email, password: "123456" });

    const Jwt = AuthService.verifyToken(response.body.token);
    expect(Jwt).toMatchObject({ sub: user.id });

    expect(response.status).toBe(200);
  });
});
