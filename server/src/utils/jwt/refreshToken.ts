import { SignJWT, jwtVerify } from "jose";
import { generateUrlSafeToken } from "../token.ts";
import { EDDSA_PRIVATE_KEY, EDDSA_PUBLIC_KEY, REFRESH_TOKEN_EXPIRY } from "../../config.ts";

type RefreshTokenPayload = {
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
    // If token exists then verify it
    if (token) {
      const { payload } = await jwtVerify(token, EDDSA_PUBLIC_KEY, {
        algorithms: [ALG],
      });

      return new RefreshToken(payload as unknown as RefreshTokenPayload, token);
    }

    // Otherwise, create a new one
    const now = Math.floor(Date.now() / 1000);
    const payloadInfo: RefreshTokenPayload = {
      sub,
      jti: generateUrlSafeToken(),
      iat: now,
      exp: now + Number(REFRESH_TOKEN_EXPIRY)!,
      typ: "refresh",
    };

    const signedToken = await new SignJWT({ ...payloadInfo })
      .setProtectedHeader({ alg: ALG })
      .sign(EDDSA_PRIVATE_KEY);

    return new RefreshToken(payloadInfo, signedToken);
  }

  /**
   * Get the Refresh token
   * @returns Returns the refresh token in string format
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Get the creation time of the refresh token
   * @returns UNIX time of creation
   */
  creationTime(): number {
    return this.payload.iat;
  }

  /**
   * Get the JWT Indentifier
   * @returns ID in string format
   */
  getJti(): string {
    return this.payload.jti;
  }

  /**
   * Get the expiry time of the refresh token
   * @returns UNIX time of expiry
   */
  expiryTime(): number {
    return this.payload.exp;
  }
}
