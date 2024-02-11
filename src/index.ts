import express from "express";
import cors from "cors";
import { env } from "./env";

const server = express();

server.use(cors());
server.use(express.json());

server.listen(env.PORT, async () => {
  console.log(`Server is running at ${env.PORT}`);
});
