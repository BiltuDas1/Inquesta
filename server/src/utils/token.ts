import { randomBytes } from "crypto";

/**
 * Generates a cryptographically secure, URL-safe token.
 * @param bytes - The number of random bytes (32 bytes = 256 bits of entropy)
 */
export function generateUrlSafeToken(bytes: number = 32): string {
  return randomBytes(bytes).toString("base64url");
}
