import { db } from "../config.ts";
import { cart } from "../databases/schema.ts";
import { JWT } from "../utils/jwt/jwt.ts";

export async function addCourseCart(access_token: string, id: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    await db.insert(cart).values({
      user_id: accessToken.getSub(),
      course_id: id
    })
  
    return {
      success: true,
      message: "successfully added course to the cart"
    }
  } catch (error) {
    return {
      success: false,
      message: "failed to add course in the cart"
    }
  }
}
