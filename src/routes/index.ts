import { WeatherController } from "@/controller/weather";
import { UserController } from "@/controller/users";
import { authMiddleware } from "@/middleware/authentication";
import { UserPrismaDBRepository } from "@/repositories/prisma/prisma-user-repository";
import { Application } from "express";
import { PlaceController } from "@/controller/places";
import { PlacePrismaDBRepository } from "@/repositories/prisma/prisma-place-repository";

const userController = new UserController(new UserPrismaDBRepository());
const placeController = new PlaceController(new PlacePrismaDBRepository());
const weatherController = new WeatherController(new PlacePrismaDBRepository());

export function configureRouter(app: Application) {
  app.route("/users").post(userController.create.bind(userController));
  app
    .route("/users/authenticate")
    .post(userController.authenticate.bind(userController));
  app
    .route("/users/me")
    .get(authMiddleware, userController.me.bind(userController));
  app
    .route("/places")
    .post(authMiddleware, placeController.create.bind(placeController));
  app
    .route("/places/weather")
    .get(authMiddleware, weatherController.getWeather.bind(weatherController));
}
