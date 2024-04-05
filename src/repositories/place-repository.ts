import { Place, Prisma } from "@prisma/client";

export interface PlaceRepository {
  create(data: Prisma.PlaceUncheckedCreateInput): Promise<Place>;
  findAllPlaces(id: string): Promise<Place[]>;
  deleteAllPlaces(): Promise<void>;
}
