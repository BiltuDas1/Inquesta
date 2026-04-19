// Server Configuration & Environment
import { requireEnv } from "./errors/environment.ts";
import { drizzle } from "drizzle-orm/mysql2";
import { Email } from "./utils/email.ts";
import { Template } from "./utils/template.ts";
import { createClient } from "redis";
import { OAuth2Client } from "google-auth-library";
import { importPKCS8, importSPKI } from "jose";
import * as crypto from "crypto";

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
export const redis = createClient({
  url: requireEnv("REDIS_URI"),
});
redis.on("error", (err) => console.error("Redis Client Error", err));

// JWT Token Expiry
export const ACCESS_TOKEN_EXPIRY = 900;
export const REFRESH_TOKEN_EXPIRY = 3600 * 24 * 30;
// export const EDDSA_PRIVATE_KEY = requireEnv("EDDSA_PRIVATE_KEY");

// Google Authentication
export const GOOGLE_CLIENT = new OAuth2Client({
  clientId: requireEnv("GOOGLE_CLIENT_ID"),
  clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
  redirectUri: requireEnv("GOOGLE_REDIRECT_URI")
});

// EdDSA Keys
export let EDDSA_PRIVATE_KEY: CryptoKey
export let EDDSA_PUBLIC_KEY: CryptoKey

export async function loadEdDSAKey() {
  const private_key_str = Buffer.from(requireEnv("EDDSA_PRIVATE_KEY"), "base64").toString("utf-8");
  EDDSA_PRIVATE_KEY = await importPKCS8(private_key_str, "EdDSA");
  const public_key_str = crypto.createPublicKey(private_key_str).export({
    type: "spki",
    format: "pem",
  });
  EDDSA_PUBLIC_KEY = await importSPKI(public_key_str, "EdDSA");
}
