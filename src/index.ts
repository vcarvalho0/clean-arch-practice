import logger from "./logger";
import { ServerSetup } from "./server";

const startServer = async (): Promise<void> => {
  try {
    const server = new ServerSetup();
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

    for (const exitSigal of exitSignals) {
      process.on(exitSigal, async () => {
        try {
          await server.close();
          logger.info("Server closed");
          process.exit(1);
        } catch (err) {
          logger.error(`Server exited with error ${err}`);
          process.exit(0);
        }
      });
    }
  } catch (error) {
    logger.error(`Something unexpected happened ${error}`);
    process.exit(0);
  }
};

startServer();
