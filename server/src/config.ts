// Server Configuration & Environment
import { requireEnv } from "./errors/environment.ts";
import { drizzle } from "drizzle-orm/mysql2";
import { Email } from "./utils/email.ts";
import { Template } from "./utils/template.ts";
import { createClient } from "redis";

export const isProduction = process.env.PRODUCTION !== undefined;
export const serverConfig = {
  host: isProduction ? "0.0.0.0" : "127.0.0.1",
  port: 4000,
  endpoint: "/",
};
export const db = drizzle(requireEnv("MYSQL_URI"));

// CORS
export const allowedOrigins: string[] = [];
if (process.env.ORIGINS !== undefined) {
  allowedOrigins.push(
    ...process.env.ORIGINS.split(/[\s,]+/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0),
  );
}

export const emailObj = new Email(requireEnv("RESEND_API_KEY"));
export const templateObj = new Template();

// Redis connection
const client = createClient({
  url: requireEnv("REDIS_URI"),
});
client.on("error", (err) => console.error("Redis Client Error", err));

await client.connect();
export const redis = client;
