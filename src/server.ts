import express, { Application } from "express";
import cors from "cors";
import { env } from "./env";
import { configureRouter } from "./routes";
import * as database from "./database";
import logger from "./logger";

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
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.express.listen(env.PORT, () => {
      logger.info(`Server is running at ${env.PORT}`);
    });
  }
}
