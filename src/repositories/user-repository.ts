import { User, Prisma } from "@prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  deleteAll(): Promise<void>;
}
