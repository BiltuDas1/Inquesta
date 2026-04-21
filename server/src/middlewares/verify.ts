import type { Auth } from "../types/auth.ts";
import type { FastifyContext } from "../types/fastify.ts";
import * as cookie from 'cookie';
import { JWT } from "../utils/jwt/jwt.ts";

export async function verify_user(context: FastifyContext): Promise<Auth> {
  if (context.req.headers.cookie === undefined) {
    return {
      isValidSession: false
    }
  }

  const cookieObj = cookie.parseCookie(context.req.headers.cookie);
  if (cookieObj["access_token"] === undefined) {
    return {
      isValidSession: false
    }
  }

  const accessToken = await JWT.toAccessToken(cookieObj["access_token"])
  if (accessToken === null) {
    return {
      isValidSession: false
    }
  }

  const unixTime = Math.floor(Date.now() / 1000);
  if (!(unixTime >= accessToken.creationTime() && unixTime <= accessToken.expiryTime())) {
    return {
      isValidSession: false
    }
  }

  return {
    isValidSession: true
  };
}
