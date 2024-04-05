import { WeatherAPI, WeatherNormalized } from "@/clients/weather-api";
import { Place } from "@prisma/client";

export interface PlaceWeatherResponse extends WeatherNormalized {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export class WeatherProcessingError extends Error {
  constructor(message: string) {
    super(`Something went wrong while processing weather data: ${message}`);
  }
}

export class WeatherService {
  constructor(protected weatherAPI = new WeatherAPI()) {}

  public async processWeatherForPlaces(
    places: Place[]
  ): Promise<PlaceWeatherResponse[]> {
    const weatherForEachPlace: PlaceWeatherResponse[] = [];
    try {
      for (const place of places) {
        const weather = await this.weatherAPI.fetch(
          place.lat.toNumber(),
          place.lon.toNumber()
        );

        const enriched = this.enrichWeatherData(place, weather);

        weatherForEachPlace.push(enriched);
      }

      return weatherForEachPlace;
    } catch (error) {
      throw new WeatherProcessingError((error as Error).message);
    }
  }

  private enrichWeatherData(place: Place, weather: WeatherNormalized) {
    return {
      ...{
        name: place.name,
        country: place.country,
        lat: place.lat.toNumber(),
        lon: place.lon.toNumber(),
        ...weather
      }
    };
  }
}
