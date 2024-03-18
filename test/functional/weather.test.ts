import { ServerSetup } from "@/server";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Forecast tests", () => {
  let server: ServerSetup;

  beforeAll(async () => {
    server = new ServerSetup();

    await server.init();
  });

  it("Should return forecast data", async () => {
    const { body, status } = await request(server.getExpress()).get(
      "/forecast"
    );

    expect(status).toBe(200);
    expect(body).toEqual({
      name: "London",
      country: "United Kingdom",
      lat: 51.52,
      lon: -0.11,
      temp_c: 9,
      temp_f: 48.2,
      condition: {
        text: "Clear",
        icon: "//cdn.weatherapi.com/weather/64x64/night/113.png",
        code: 1000
      },
      wind_mph: 6.9,
      wind_kph: 11.2,
      wind_direction: "SW",
      feelslike_c: 7.2,
      feelslike_f: 45,
      uv: 0
    });
  });
});
