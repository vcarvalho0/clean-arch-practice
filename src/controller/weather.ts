import { PlaceRepository } from "@/repositories/place-repository";
import { WeatherService } from "@/services/weather";
import { Request, Response } from "express";
import { BaseController } from ".";

const weatherService = new WeatherService();

export class WeatherController extends BaseController {
  constructor(private placesRepository: PlaceRepository) {
    super();
  }

  public async getWeather(req: Request, res: Response) {
    if (!req.headers.user) {
      this.customErrorResponse(res, {
        code: 500,
        message: "You need to provide userId"
      });
    }

    const places = await this.placesRepository.findAllPlaces(
      req.headers.user as string
    );

    const weather = await weatherService.processWeatherForPlaces(places);

    res.status(200).send(weather);
  }
}
