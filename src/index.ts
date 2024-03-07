import logger from "./logger";
import { ServerSetup } from "./server";

enum Process {
  SUCCESS = 1,
  FAILURE = 0
}

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled promise: ${promise} and reason ${reason}`);

  throw reason;
});

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
          process.exit(Process.SUCCESS);
        } catch (err) {
          logger.error(`Server exited with error ${err}`);
          process.exit(Process.FAILURE);
        }
      });
    }
  } catch (error) {
    logger.error(`Something unexpected happened ${error}`);
    process.exit(Process.FAILURE);
  }
};

startServer();
