import { PlaceRepository } from "@/repositories/place-repository";
import { WeatherService } from "@/services/weather";
import { Request, Response } from "express";
import { BaseController } from ".";
import rateLimit from "express-rate-limit";
import ErrorFormat from "@/utils/error-format";

const weatherService = new WeatherService();

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  keyGenerator(req: Request): string {
    return req.ip!;
  },
  handler(_, res: Response): void {
    res.status(429).send(
      ErrorFormat.format({
        code: 429,
        message:
          "Too many requests to the endpoint /places/weather, try again later"
      })
    );
  }
});

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
