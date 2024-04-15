import express, { Application } from "express";
import cors from "cors";
import { env } from "./env";
import http from "http";
import { configureRouter } from "./routes";
import * as database from "./database";
import swaggerUi from "swagger-ui-express";
import swaggerSchema from "@/swagger-schema.json";
import logger from "./logger";

export class ServerSetup {
  private express: express.Application;
  private server: http.Server;

  constructor() {
    this.express = express();
    this.server = http.createServer(this.express);
  }

  public async init(): Promise<void> {
    await this.database();
    await this.docsSetup();

    this.middlewareSetup();
  }

  private async docsSetup(): Promise<void> {
    this.express.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSchema));
  }

  private middlewareSetup(): void {
    this.express.use(
      cors({
        origin: "*"
      })
    );
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
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server.close((err) => {
          if (err) {
            return reject(err);
          }

          resolve(true);
        });
      });
    }
  }

  public start(): void {
    this.server.listen(env.PORT, () => {
      logger.info(`Server is running at ${env.PORT}`);
    });
  }
}
