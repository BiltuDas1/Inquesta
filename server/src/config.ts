// Server Configuration & Environment
import { requireEnv } from "./errors/environment.ts";
import { drizzle } from "drizzle-orm/mysql2";

export const isProduction = process.env.PRODUCTION !== undefined;
export const serverConfig = {
  host: isProduction ? "0.0.0.0" : "127.0.0.1",
  port: 4000,
  endpoint: "/",
};
export const db = drizzle(requireEnv("MYSQL_URI"));
