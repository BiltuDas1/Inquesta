import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";
import * as crypto from "crypto";
import { generateUrlSafeToken } from "../token.ts";
import { ACCESS_TOKEN_EXPIRY } from "../../config.ts";

// ACCESS TOKEN
interface AccessTokenPayload {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  typ: "access";
}

const ALG = "EdDSA";

export class AccessToken {
  private payload: AccessTokenPayload;
  private token: string;

  private constructor(payload: AccessTokenPayload, token: string) {
    this.payload = payload;
    this.token = token;
  }

  static async init(sub: string, token?: string): Promise<AccessToken> {
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

    // If the token exists then verify it
    if (token) {
      // Import the dynamically generated public key
      const publicKey = await importSPKI(publicKeyPem as string, ALG);

      const { payload } = await jwtVerify(token, publicKey, {
        algorithms: [ALG],
      });

      return new AccessToken(payload as unknown as AccessTokenPayload, token);
    }

    // Otherwise, create a new one
    const now = Math.floor(Date.now() / 1000);
    const payloadInfo: AccessTokenPayload = {
      sub,
      jti: generateUrlSafeToken(),
      iat: now,
      exp: now + Number(ACCESS_TOKEN_EXPIRY)!,
      typ: "access",
    };

    const privateKey = await importPKCS8(privateKeyPem, ALG);

    const signedToken = await new SignJWT({ ...payloadInfo })
      .setProtectedHeader({ alg: ALG })
      .sign(privateKey);

    return new AccessToken(payloadInfo, signedToken);
  }

  // Return the token
  getToken(): string {
    return this.token;
  }

  // Return the token creation time
  creationTime(): number {
    return this.payload.iat;
  }

  // Return Expiry time
  expiryTime(): number {
    return this.payload.exp;
  }
}
