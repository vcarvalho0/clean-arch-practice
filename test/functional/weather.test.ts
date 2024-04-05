import request from "supertest";
import nock from "nock";
import { ServerSetup } from "@/server";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { UserPrismaDBRepository } from "@/repositories/prisma/prisma-user-repository";
import JwtService from "@/services/jwt";
import { PlacePrismaDBRepository } from "@/repositories/prisma/prisma-place-repository";
import weatherFixture from "../fixtures/weather.json";
import weatherServiceResponseFixture from "../fixtures/weather_service_response.json";

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
    await places.deleteAllPlaces();
    await usersRepository.deleteAll();

    const user = await usersRepository.create(defaultUser);
    token = JwtService.generateToken(user.id);

    const defaultPlace = {
      name: "London",
      country: "United Kingdom",
      lat: 51.52,
      lon: -0.11,
      userId: user.id
    };

    await places.create(defaultPlace);
  });

  it("Should return weather data for each place", async () => {
    nock("https://api.weatherapi.com:443", {
      encodedQueryParams: true
    })
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/v1/current.json")
      .query({
        key: "yourweatherapikey",
        q: "51.52%2C-0.11"
      })
      .reply(200, weatherFixture);

    const { body, status } = await request(server.getExpress())
      .get("/places/weather")
      .set("Authorization", `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toEqual(weatherServiceResponseFixture);
  });
});
