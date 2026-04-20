import { SignJWT, jwtVerify } from "jose";
import { generateUrlSafeToken } from "../token.ts";
import { ACCESS_TOKEN_EXPIRY, EDDSA_PRIVATE_KEY, EDDSA_PUBLIC_KEY } from "../../config.ts";

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
    // If the token exists then verify it
    if (token) {
      const { payload } = await jwtVerify(token, EDDSA_PUBLIC_KEY, {
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

    const signedToken = await new SignJWT({ ...payloadInfo })
      .setProtectedHeader({ alg: ALG })
      .sign(EDDSA_PRIVATE_KEY);

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
