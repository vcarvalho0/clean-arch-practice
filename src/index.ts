import logger from "./logger";
import { ServerSetup } from "./server";

const startServer = async (): Promise<void> => {
  try {
    const server = new ServerSetup();
    await server.init();
    server.start();
  } catch (error) {
    logger.error(`Something went wrong ${error}`);
  }
};

startServer();
