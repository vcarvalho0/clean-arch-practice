import { ServerSetup } from "./server";

const startServer = async (): Promise<void> => {
  try {
    const server = new ServerSetup();
    await server.init();
    server.start();
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

startServer();
