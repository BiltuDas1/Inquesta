import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";
import { generateUrlSafeToken } from "../token.ts";
import * as crypto from "crypto";
import { REFRESH_TOKEN_EXPIRY } from "../../config.ts";

// REFRESH TOKEN
interface RefreshTokenPayload {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  typ: "refresh";
}

const ALG = "EdDSA";

export class RefreshToken {
  private payload: RefreshTokenPayload;
  private token: string;

  private constructor(payload: RefreshTokenPayload, token: string) {
    this.payload = payload;
    this.token = token;
  }

  static async init(sub: string, token?: string): Promise<RefreshToken> {
    if (!process.env.EDDSA_PRIVATE_KEY) {
      throw new Error(
        "EDDSA_PRIVATE_KEY is missing from environment variables.",
      );
    }

    // Format the private key from the environment
    const privateKeyPem = process.env.EDDSA_PRIVATE_KEY.replace(/\\n/g, "\n");

    // Dynamically generate the public key from the private key
    const keyObject = crypto.createPublicKey(privateKeyPem);
    const publicKeyPem = keyObject.export({
      type: "spki",
      format: "pem",
    });

    // If token exists then verify it
    if (token) {
      const publicKey = await importSPKI(publicKeyPem as string, ALG);

      const { payload } = await jwtVerify(token, publicKey, {
        algorithms: [ALG],
      });

      return new RefreshToken(payload as unknown as RefreshTokenPayload, token);
    }

    // Otherwise, create a new one
    const now = Math.floor(Date.now() / 1000);
    const payloadInfo: RefreshTokenPayload = {
      sub,
      jti: generateUrlSafeToken(), //unique id for each token
      iat: now,
      exp: now + Number(REFRESH_TOKEN_EXPIRY)!,
      typ: "refresh",
    };

    const privateKey = await importPKCS8(privateKeyPem, ALG);

    const signedToken = await new SignJWT({ ...payloadInfo })
      .setProtectedHeader({ alg: ALG })
      .sign(privateKey);

    return new RefreshToken(payloadInfo, signedToken);
  }

  // Return the token
  getToken(): string {
    return this.token;
  }

  // Return the token creation time
  creationTime(): number {
    return this.payload.iat;
  }

  // Return the unique id for each token
  getJti(): string {
    return this.payload.jti;
  }

  // Return Expiry time
  expiryTime(): number {
    return this.payload.exp;
  }
}
