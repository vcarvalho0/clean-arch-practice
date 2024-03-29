import { WeatherAPI } from "@/clients/weather-api";
import weatherNormalizedFixture from "../../../test/fixtures/weather_normalized.json";
import { describe, expect, it, vitest } from "vitest";
import { Place, WeatherService } from "../weather";

vitest.mock("@/clients/weather-api");

describe("Weather service", () => {
  it("Should return places with respective weather", async () => {
    WeatherAPI.prototype.fetch = vitest
      .fn()
      .mockResolvedValue(weatherNormalizedFixture);

    const places: Place[] = [
      {
        name: "London",
        country: "United Kingdom",
        lat: 51.52,
        lon: -0.11,
        userId: "some-user-id"
      },
      {
        name: "Amsterdam",
        country: "Netherlands",
        lat: 51.52,
        lon: -0.11,
        userId: "some-user-id"
      }
    ];

    const expectedResponse = [
      {
        name: "London",
        country: "United Kingdom",
        lat: 51.52,
        lon: -0.11,
        temp_c: 8.0,
        temp_f: 46.4,
        condition: {
          text: "Overcast",
          icon: "//cdn.weatherapi.com/weather/64x64/night/122.png",
          code: 1009
        },
        wind_mph: 6.9,
        wind_kph: 11.2,
        wind_direction: "W",
        feelslike_c: 6.0,
        feelslike_f: 42.9,
        uv: 1.0
      },
      {
        name: "Amsterdam",
        country: "Netherlands",
        lat: 51.52,
        lon: -0.11,
        temp_c: 8.0,
        temp_f: 46.4,
        condition: {
          text: "Overcast",
          icon: "//cdn.weatherapi.com/weather/64x64/night/122.png",
          code: 1009
        },
        wind_mph: 6.9,
        wind_kph: 11.2,
        wind_direction: "W",
        feelslike_c: 6.0,
        feelslike_f: 42.9,
        uv: 1.0
      }
    ];

    const weather = new WeatherService(new WeatherAPI());
    const weatherPlaces = await weather.processWeatherForPlaces(places);
    expect(weatherPlaces).toEqual(expectedResponse);
  });
});
