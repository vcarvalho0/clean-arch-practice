import request from "supertest";
import JwtService from "@/services/jwt";
import { UserPrismaDBRepository } from "@/repositories/prisma/prisma-user-repository";
import { ServerSetup } from "@/server";
import { beforeAll, describe, expect, it } from "vitest";

describe("Places tests", () => {
  const usersRepository = new UserPrismaDBRepository();

  let server: ServerSetup;
  beforeAll(async () => {
    server = new ServerSetup();

    await server.init();
  });

  it("Should create a new place", async () => {
    const place = {
      name: "London",
      country: "United Kingdom",
      lat: 51.52,
      lon: -0.11
    };

    const defaultUser = {
      username: "John Doe",
      email: "johndoe@email.com",
      password: "123456"
    };

    const user = await usersRepository.create(defaultUser);
    const token = JwtService.generateToken(user.id);

    const response = await request(server.getExpress())
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send(place);

    expect(response.status).toBe(201);
  });
});
