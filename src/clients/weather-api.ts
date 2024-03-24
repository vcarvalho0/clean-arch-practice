import * as HTTP from "@/utils/request";
import { env } from "@/env";

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface WeatherLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface WeatherCurrent {
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_dir: string;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
}

interface WeatherResponse {
  location: WeatherLocation;
  current: WeatherCurrent;
}

interface WeatherNormalized {
  name: string;
  country: string;
  lat: number;
  lon: number;
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_direction: string;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
}

export class ClientError extends Error {
  constructor(message: string) {
    const internalMessage = "Error when requesting data from WeatherAPI";
    super(`${internalMessage}: ${message}`);
  }
}

export class WeatherAPI {
  constructor(protected request = new HTTP.Request()) {}

  public async fetch(lat: number, lon: number): Promise<WeatherNormalized> {
    try {
      const response = await this.request.get<WeatherResponse>(
        `https://api.weatherapi.com/v1/current.json?key=${env.WEATHER_API_KEY}q=${lat},${lon}`,
        {}
      );

      return this.normalizeData(response.data);
    } catch (error) {
      throw new ClientError(JSON.stringify(error));
    }
  }

  private normalizeData(data: WeatherResponse): WeatherNormalized {
    return {
      name: data.location.name,
      country: data.location.country,
      lat: data.location.lat,
      lon: data.location.lon,
      temp_c: data.current.temp_c,
      temp_f: data.current.temp_f,
      condition: {
        text: data.current.condition.text,
        icon: data.current.condition.icon,
        code: data.current.condition.code
      },
      wind_mph: data.current.wind_mph,
      wind_kph: data.current.wind_kph,
      wind_direction: data.current.wind_dir,
      feelslike_c: data.current.feelslike_c,
      feelslike_f: data.current.feelslike_f,
      uv: data.current.uv
    };
  }
}
