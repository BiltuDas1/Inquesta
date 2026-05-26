import { and, eq } from "drizzle-orm";
import { db } from "../config.ts";
import { cart, courses } from "../databases/schema.ts";
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
      course_id: id,
    });

    return {
      success: true,
      message: "successfully added course to the cart",
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to add course in the cart",
    };
  }
}

export async function getItemsFromCart(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    const result = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        price: courses.price,
        level: courses.level,
        duration: courses.duration,
        instructorName: courses.instructorName,
        iconName: courses.iconName,
        slug: courses.slug,
      })
      .from(cart)
      .innerJoin(courses, eq(cart.course_id, courses.id))
      .where(eq(cart.user_id, accessToken.getSub()));
    return {
      success: true,
      message: "successfully fetch cart items",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to add course in the cart",
    };
  }
}

export async function removeFromCart(access_token: string, courseId: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  const userId = accessToken.getSub();
  try {
    await db
      .delete(cart)
      .where(and(eq(cart.user_id, userId), eq(cart.course_id, courseId)));
    return {
      success: true,
      message: "successfully removed course from the cart",
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to remove course from the cart",
    };
  }
}
