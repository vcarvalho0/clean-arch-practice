import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.string()
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error(envServer.error.format());

  throw new Error("Error environment variables");
}

export const env = envServer.data;
