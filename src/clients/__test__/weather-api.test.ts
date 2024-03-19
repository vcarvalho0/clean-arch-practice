import { describe, expect, it, vitest } from "vitest";
import { WeatherAPI } from "../weather-api";
import weatherFixture from "../../../test/fixtures/weather.json";
import weatherFixtureNormalized from "../../../test/fixtures/weather_normalized.json";
import axios from "axios";

vitest.mock("axios");

describe("WeatherAPI tests", () => {
  it("Should normalize data", async () => {
    const lat = -23.583988;
    const lon = -46.466173;

    axios.get = vitest.fn().mockResolvedValue({ data: weatherFixture });

    const weatherAPI = new WeatherAPI(axios);

    const response = await weatherAPI.fetch(lat, lon);

    expect(response).toEqual(weatherFixtureNormalized);
  });

  it("Should return an ERROR when WeatherAPI service fail", async () => {
    const lat = -23.583988;
    const lon = -46.466173;

    axios.get = vitest.fn().mockRejectedValue("Network Error");

    const weatherAPI = new WeatherAPI(axios);

    await expect(weatherAPI.fetch(lat, lon)).rejects.toThrow(
      'Error when requesting data from WeatherAPI: "Network Error"'
    );
  });
});
