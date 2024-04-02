import { ServerSetup } from "@/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { UserPrismaDBRepository } from "@/repositories/prisma/prisma-user-repository";
import JwtService from "@/services/jwt";
import { PlacePrismaDBRepository } from "@/repositories/prisma/prisma-place-repository";
import weatherNormalizedFixture from "../fixtures/weather_normalized.json";

describe("Weather tests", () => {
  let server: ServerSetup;

  const defaultUser = {
    username: "John Doe",
    email: "johndoe@email.com",
    password: "123456"
  };

  const places = new PlacePrismaDBRepository();
  const usersRepository = new UserPrismaDBRepository();
  beforeAll(async () => {
    server = new ServerSetup();

    await server.init();
  });

  let token: string;
  beforeEach(async () => {
    const user = await usersRepository.create(defaultUser);
    token = JwtService.generateToken(user.id);

    const defaultPlace = {
      name: "London",
      country: "United Kingdom",
      lat: 51.52,
      lon: -0.11,
      userId: user.id
    };

    await places.deleteAllPlaces();
    await places.create(defaultPlace);
  });

  afterEach(async () => {
    await places.deleteAllPlaces();
    await usersRepository.deleteAll();
  });

  it("Should return weather data", async () => {
    const { body, status } = await request(server.getExpress())
      .get("/places/weather")
      .set("Authorization", `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toEqual(weatherNormalizedFixture);
  });
});
