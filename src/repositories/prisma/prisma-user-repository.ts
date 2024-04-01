import { prisma } from "@/database";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../user-repository";
import { HandlePrismaError } from "./handle-prisma-error";

export class UserPrismaDBRepository
  extends HandlePrismaError
  implements UsersRepository
{
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user
      .create({
        data
      })
      .catch((error) => this.handleError(error));

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const findByEmail = await prisma.user.findUnique({
      where: {
        email
      }
    });

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
}
