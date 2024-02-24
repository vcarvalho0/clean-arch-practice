import { UserController } from "@/controller/user";
import { authMiddleware } from "@/middleware/authentication";
import { UserPrismaDBRepository } from "@/repositories/prisma-user-repository";
import { Application } from "express";

const userController = new UserController(new UserPrismaDBRepository());

export function configureRouter(app: Application) {
  app.route("/users").post(userController.create.bind(userController));
  app
    .route("/users/authenticate")
    .post(userController.authenticate.bind(userController));
  app
    .route("/users/me")
    .get(authMiddleware, userController.me.bind(userController));
}
