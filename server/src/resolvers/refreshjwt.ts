import { redis } from "../config.ts";
import { JWT } from "../utils/jwt/jwt.ts";

type RefreshResponse = {
  success: boolean;
  message: string;
  jwt?: JWT;
};

export async function refresh_jwt(
  refresh_token: string,
): Promise<RefreshResponse> {
  const refreshToken = await JWT.toRefreshToken(refresh_token);
  if (refreshToken === null) {
    return {
      success: false,
      message: "refresh token is invalid or expired",
    };
  }

  const user_id = await redis.get("inquesta:user:jwt:" + refreshToken.getJti());
  if (user_id === null) {
    return {
      success: false,
      message: "refresh token is invalid or expired",
    };
  }

  await redis.del("inquesta:user:jwt:" + refreshToken.getJti()); // Delete the already existing JWT

  const newJWT = await JWT.init(user_id);
  await redis.set(
    "inquesta:user:jwt:" + newJWT.refreshToken.getJti(),
    user_id,
    {
      expiration: {
        type: "EXAT",
        value: newJWT.refreshToken.expiryTime(),
      },
    },
  );

  return {
    success: true,
    message: "successfully generated new JWT",
    jwt: newJWT,
  };
}
