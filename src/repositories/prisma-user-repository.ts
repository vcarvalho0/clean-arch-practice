import { prisma } from "@/database";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "./user-repository";
import {
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError
} from "./handle-database-errors";
import logger from "@/logger";

export class UserPrismaDBRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user
      .create({
        data
      })
      .catch((error) => this.handleError(error));

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const findByEmail = await prisma.user
      .findUnique({
        where: {
          email
        }
      })
      .catch((error) => this.handleError(error));

    return findByEmail;
  }

  async findById(id: string): Promise<User | null> {
    const findById = await prisma.user.findUnique({
      where: {
        id
      }
    });

    return findById;
  }

  async deleteAll(): Promise<void> {
    await prisma.user.deleteMany({});
  }

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
