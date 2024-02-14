import { UserController } from "@/controller/user";
import { Application } from "express";

const userController = new UserController();

export function configureRouter(app: Application) {
  app.route("/users").post(userController.create);
}
