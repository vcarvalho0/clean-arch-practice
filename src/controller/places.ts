import { Request, Response } from "express";
import { PlaceRepository } from "@/repositories/place-repository";
import { BaseController } from ".";
import { z } from "zod";

export class PlaceController extends BaseController {
  constructor(private placesRepository: PlaceRepository) {
    super();
  }

  async create(req: Request, res: Response): Promise<void> {
    const placeSchema = z.object({
      name: z.string(),
      country: z.string(),
      lat: z.number(),
      lon: z.number()
    });

    const body = placeSchema.parse(req.body);

    try {
      const place = await this.placesRepository.create({
        ...body,
        ...{ userId: req.headers.user as string }
      });

      res.status(201).send(place);
    } catch (error) {
      this.sendCreateErrorResponse(res, error);
    }
  }
}
