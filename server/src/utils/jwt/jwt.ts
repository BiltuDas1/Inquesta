import { AccessToken } from "./accessToken.ts";
import { RefreshToken } from "./refreshToken.ts";

interface User {
  id: string;
}

export class JWT {
  private accessToken!: AccessToken;
  private refreshToken!: RefreshToken;

  private constructor() {}

  //  Create both tokens
  static async init(user: User): Promise<JWT> {
    const jwtObj = new JWT();

    jwtObj.accessToken = await AccessToken.init(user.id);
    jwtObj.refreshToken = await RefreshToken.init(user.id);

    return jwtObj;
  }

  //   Return  both tokens
  toObj(): { access_token: string; refresh_token: string } {
    return {
      access_token: this.accessToken.getToken(),
      refresh_token: this.refreshToken.getToken(),
    };
  }

  static async toRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      return await RefreshToken.init("", token);
    } catch (error) {
      return null;
    }
  }
}
