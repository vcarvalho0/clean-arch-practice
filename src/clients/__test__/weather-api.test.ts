import { describe, expect, it, vitest } from "vitest";
import { WeatherAPI } from "../weather-api";
import axios from "axios";

vitest.mock("axios");

describe("WeatherAPI tests", () => {
  it("Should serialize data", async () => {
    const lat = -23.583988;
    const lon = -46.466173;

    axios.get = vitest.fn().mockResolvedValue({});

    const weatherAPI = new WeatherAPI(axios);

    const response = await weatherAPI.fetch(lat, lon);

    expect(response).toEqual({});
  });
});
