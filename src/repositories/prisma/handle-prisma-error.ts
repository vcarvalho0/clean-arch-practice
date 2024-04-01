import logger from "@/logger";
import {
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError
} from "../handle-database-errors";
import { Prisma } from "@prisma/client";

export class HandlePrismaError {
  protected handleError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const conflictDatabaseError = error.code === "P2002";

      if (conflictDatabaseError) {
        throw new DatabaseValidationError(error.message);
      }
      throw new DatabaseUnknownClientError(error.message);
    }

    logger.error("Database Error", error);
    throw new DatabaseInternalError(
      "Something unexpected happened to the database"
    );
  }
}
