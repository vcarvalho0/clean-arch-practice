import { AxiosStatic } from "axios";
import { env } from "@/env";

export class WeatherAPI {
  constructor(protected request: AxiosStatic) {}

  public async fetch(lat: number, lon: number) {
    const response = await this.request.get(
      `http://api.weatherapi.com/v1/current.json?key=${env.WEATHER_API_KEY}q=${lat},${lon}`,
      {}
    );

    return response;
  }
}
