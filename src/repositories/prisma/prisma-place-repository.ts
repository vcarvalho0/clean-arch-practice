import { Place, Prisma } from "@prisma/client";
import { HandlePrismaError } from "./handle-prisma-error";
import { prisma } from "@/database";

export class PlacePrismaDBRepository
  extends HandlePrismaError
  implements PlacePrismaDBRepository
{
  async create(data: Prisma.PlaceUncheckedCreateInput): Promise<Place> {
    const place = await prisma.place
      .create({
        data
      })
      .catch((error) => this.handleError(error));

    return place;
  }

  async findAllPlaces(id: string): Promise<Place[]> {
    const places = await prisma.place.findMany({
      where: {
        userId: id
      }
    });

    return places;
  }

  async deleteAllPlaces(): Promise<void> {
    await prisma.place.deleteMany({});
  }
}
