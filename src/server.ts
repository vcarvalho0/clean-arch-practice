import express, { Application } from "express";
import cors from "cors";
import { env } from "./env";
import { configureRouter } from "./routes";
import { prisma } from "./database";

export class ServerSetup {
  private express: express.Application;

  constructor() {
    this.express = express();
  }

  public async init(): Promise<void> {
    await this.database();

    this.middlewareSetup();
  }

  private middlewareSetup(): void {
    this.express.use(cors());
    this.express.use(express.json());

    configureRouter(this.express);
  }

  public getExpress(): Application {
    return this.express;
  }

  public async database(): Promise<void> {
    await prisma.$connect();
  }

  public start(): void {
    this.express.listen(env.PORT, () => {
      console.log(`Server is running at ${env.PORT}`);
    });
  }
}
