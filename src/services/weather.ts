import { WeatherAPI, WeatherNormalized } from "@/clients/weather-api";

export interface Place {
  name: string;
  country: string;
  lat: number;
  lon: number;
  userId: string;
}

export interface PlaceWithWeather
  extends Omit<Place, "userId">,
    WeatherNormalized {}

export class WeatherService {
  constructor(protected weatherAPI = new WeatherAPI()) {}

  public async processWeatherForPlaces(
    places: Place[]
  ): Promise<PlaceWithWeather[]> {
    const weatherForEachPlace: PlaceWithWeather[] = [];
    for (const place of places) {
      const weather = await this.weatherAPI.fetch(place.lat, place.lon);
      const enrichWeatherData = {
        ...{
          name: place.name,
          country: place.country,
          lat: place.lat,
          lon: place.lon,
          ...weather
        }
      };
      weatherForEachPlace.push(enrichWeatherData);
    }
    return weatherForEachPlace;
  }
}
