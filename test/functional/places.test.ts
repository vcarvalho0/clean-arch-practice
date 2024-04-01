import { UserPrismaDBRepository } from "@/repositories/prisma/prisma-user-repository";
import { ServerSetup } from "@/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import JwtService from "@/services/jwt";
import { PlacePrismaDBRepository } from "@/repositories/prisma/prisma-place-repository";

describe("Places tests", () => {
  const defaultUser = {
    username: "John Doe",
    email: "johndoe@email.com",
    password: "123456"
  };

  let server: ServerSetup;
  const usersRepository = new UserPrismaDBRepository();
  const placesRepository = new PlacePrismaDBRepository();
  beforeAll(async () => {
    server = new ServerSetup();
    await server.init();
  });

  let token: string;
  beforeEach(async () => {
    const user = await usersRepository.create(defaultUser);
    token = JwtService.generateToken(user.id);
  });

  afterEach(async () => {
    await placesRepository.deleteAllPlaces();
    await usersRepository.deleteAll();
  });

  it("Should create a new place", async () => {
    const place = {
      name: "London",
      country: "United Kingdom",
      lat: 51.52,
      lon: -0.11
    };

    const response = await request(server.getExpress())
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send(place);

    expect(response.status).toBe(201);
  });
});
