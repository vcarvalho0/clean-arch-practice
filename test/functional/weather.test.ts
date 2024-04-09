import request from "supertest";
import nock from "nock";
import JwtService from "@/services/jwt";
import weatherFixture from "../fixtures/weather.json";
import weatherServiceResponseFixture from "../fixtures/weather_service_response.json";
import { ServerSetup } from "@/server";
import { beforeEach, beforeAll, describe, expect, it } from "vitest";
import { UserPrismaDBRepository } from "@/repositories/prisma/prisma-user-repository";
import { PlacePrismaDBRepository } from "@/repositories/prisma/prisma-place-repository";

describe("Weather tests", () => {
  const placesRepository = new PlacePrismaDBRepository();
  const usersRepository = new UserPrismaDBRepository();

  const defaultUser = {
    username: "John Doe",
    email: "johndoe@email.com",
    password: "123456"
  };

  let server: ServerSetup;
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

    await placesRepository.create(defaultPlace);
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
