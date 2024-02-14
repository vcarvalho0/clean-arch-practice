import { prisma } from "@/database";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "./user-repository";

export class UserPrismaDBRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data
    });

    return user;
  }

  async deleteAll(): Promise<void> {
    await prisma.user.deleteMany({});
  }
}
