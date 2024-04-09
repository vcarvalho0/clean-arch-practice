import { describe, expect, it, vitest, Mocked } from "vitest";
import { WeatherAPI } from "../weather-api";
import weatherFixture from "../../../test/fixtures/weather.json";
import weatherFixtureNormalized from "../../../test/fixtures/weather_normalized.json";
import * as HTTPUtil from "@/utils/request";
import { AxiosResponse } from "axios";

vitest.mock("@/utils/request");

interface Response<T = unknown> extends AxiosResponse<T> {}

describe("WeatherAPI tests", () => {
  const mockedAxios = new HTTPUtil.Request() as Mocked<HTTPUtil.Request>;
  it("Should normalize data", async () => {
    const lat = -23.583988;
    const lon = -46.466173;

    mockedAxios.get.mockResolvedValue({ data: weatherFixture } as Response);

    const weatherAPI = new WeatherAPI(mockedAxios);

    const response = await weatherAPI.fetch(lat, lon);

    expect(response).toEqual(weatherFixtureNormalized);
  });

  it("Should return an ERROR when WeatherAPI service fail", async () => {
    const lat = -23.583988;
    const lon = -46.466173;

    mockedAxios.get.mockRejectedValue("Network Error");

    const weatherAPI = new WeatherAPI(mockedAxios);

    await expect(weatherAPI.fetch(lat, lon)).rejects.toThrow(
      'Something unexpected happened to the client: "Network Error"'
    );
  });
});
