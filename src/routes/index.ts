import { UserController } from "@/controller/user";
import { UserPrismaDBRepository } from "@/repositories/prisma-user-repository";
import { Application } from "express";

const userController = new UserController(new UserPrismaDBRepository());

export function configureRouter(app: Application) {
  app.route("/users").post(userController.create.bind(userController));
}
