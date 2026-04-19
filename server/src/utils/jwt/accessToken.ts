import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";
import * as crypto from "crypto";
import { generateUrlSafeToken } from "../token.ts";
import { ACCESS_TOKEN_EXPIRY, EDDSA_PRIVATE_KEY } from "../../config.ts";

type AccessTokenPayload = {
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
    // Format the private key from the environment
    const privateKeyPem = EDDSA_PRIVATE_KEY.replace(/\\n/g, "\n");

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
  /**
   * Get the Access Token
   * @returns Returns the access token in string format
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Gets the token creation time
   * @returns UNIX Time of token creation
   */
  creationTime(): number {
    return this.payload.iat;
  }

  // Return the unique id for each token
  /**
   * Get the JWT Indentifier
   * @returns ID in string format
   */
  getJti(): string {
    return this.payload.jti;
  }

  /**
   * Gets the token expiry
   * @returns UNIX Time of token expiry
   */
  expiryTime(): number {
    return this.payload.exp;
  }
}
