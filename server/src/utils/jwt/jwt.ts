import { AccessToken } from "./accessToken.ts";
import { RefreshToken } from "./refreshToken.ts";

export class JWT {
  public accessToken!: AccessToken;
  public refreshToken!: RefreshToken;

  private constructor() {}

  /**
   * Initialize JWT Object
   * @param sub The main identifier for which requires the JWT
   * @returns New JWT Object
   */
  static async init(sub: string): Promise<JWT> {
    const jwtObj = new JWT();

    jwtObj.accessToken = await AccessToken.init(sub);
    jwtObj.refreshToken = await RefreshToken.init(sub);

    return jwtObj;
  }

  /**
   * Get the access and refresh token
   * @returns Returns an object containing access and refresh token
   */
  toObj(): { access_token: string; refresh_token: string } {
    return {
      access_token: this.accessToken.getToken(),
      refresh_token: this.refreshToken.getToken(),
    };
  }

  /**
   * Converts the refresh token string to RefreshToken Object
   * @param token The refresh token in string format
   * @returns If valid then returns refresh token object, otherwise returns null
   */
  static async toRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      return await RefreshToken.init("", token);
    } catch (error) {
      return null;
    }
  }

  /**
   * Converts the access token string to AccessToken Object
   * @param token The access token in string format
   * @returns If valid then returns access token object, otherwise returns null
   */
  static async toAccessToken(token: string): Promise<AccessToken | null> {
    try {
      return await AccessToken.init("", token);
    } catch (error) {
      return null;
    }
  }
}
