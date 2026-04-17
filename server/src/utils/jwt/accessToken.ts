import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";

const ALG = "EdDSA";
// const ALG = "RS256";

// ==========================================
// ACCESS TOKEN
// ==========================================

interface AccessTokenPayload {
  sub: string;
  iat: number;
  exp: number;
  type: "access";
}

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

export class AccessToken {
  private payload: AccessTokenPayload;
  private token: string;

  private constructor(payload: AccessTokenPayload, token: string) {
    this.payload = payload;
    this.token = token;
  }

  // This perfectly mirrors your original constructor's logic
  static async init(sub: string, token?: string): Promise<AccessToken> {
    
    // If the token exists then verify it
    if (token) {
      const publicKey = await importSPKI(process.env.ACCESS_PUBLIC_KEY!.replace(/\\n/g, "\n"), ALG);
      
      const { payload } = await jwtVerify(token, publicKey, {
        algorithms: [ALG],
      });
      
      return new AccessToken(payload as unknown as AccessTokenPayload, token);
    }

    // Otherwise, create a new one
    const now = Math.floor(Date.now() / 1000);
    const payloadInfo: AccessTokenPayload = {
      sub,
      iat: now,
      exp: now + Number(ACCESS_TOKEN_EXPIRY)!,
      type: "access",
    };

    const privateKey = await importPKCS8(process.env.ACCESS_PRIVATE_KEY!.replace(/\\n/g, "\n"), ALG);
    
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
