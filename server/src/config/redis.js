import { createClient } from "redis";
import { ENV } from "./env.js";

export async function connectRedis() {
  if (!ENV.REDIS_URL) throw new Error("REDIS_URL no esta definido en .env");

  const client = createClient({ url: ENV.REDIS_URL });

  client.on("error", (err) => console.error("Redis error:", err));

  await client.connect();
  console.log("Redis conectado");

  return client;
}