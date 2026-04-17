import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";

const ALG = "EdDSA";
// const ALG = "RS256";
// ==========================================
// REFRESH TOKEN
// ==========================================

interface RefreshTokenPayload {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  type: "refresh";
}

const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

export class RefreshToken {
  private payload: RefreshTokenPayload;
  private token: string;

  private constructor(payload: RefreshTokenPayload, token: string) {
    this.payload = payload;
    this.token = token;
  }

  // This perfectly mirrors your original constructor's logic
  static async init(sub: string, token?: string): Promise<RefreshToken> {
    // If token exists then verify it
    if (token) {
      const publicKey = await importSPKI(process.env.REFRESH_PUBLIC_KEY!.replace(/\\n/g, "\n"), ALG);
      
      const { payload } = await jwtVerify(token, publicKey, {
        algorithms: [ALG],
      });

      return new RefreshToken(payload as unknown as RefreshTokenPayload, token);
    }

    // Otherwise, create a new one
    const now = Math.floor(Date.now() / 1000);
    const payloadInfo: RefreshTokenPayload = {
      sub,
      jti: crypto.randomUUID(),
      iat: now,
      exp: now + Number(REFRESH_TOKEN_EXPIRY)!,
      type: "refresh",
    };

    const privateKey = await importPKCS8(process.env.REFRESH_PRIVATE_KEY!.replace(/\\n/g, "\n"), ALG);
    
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