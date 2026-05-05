import { desc, eq, lte } from "drizzle-orm";
import { db, redis, s3PublicEndpoint } from "../config.ts";
import { courseEnrollments, courses, users } from "../databases/schema.ts";
import type { Course } from "../types/course.ts";
import { JWT } from "../utils/jwt/jwt.ts";

export async function addCourse(data: Course) {
  await db.insert(courses).values(data);
  await redis.del("inquesta:courses:list");
  return true;
}

export async function getCourses(limit: number, lastID?: string | null) {
  if (lastID) {
    const response = await db
      .select()
      .from(courses)
      .where(lte(courses.id, lastID))
      .orderBy(desc(courses.id))
      .limit(limit);
    return response;
  } else {
    const response = await db
      .select()
      .from(courses)
      .orderBy(desc(courses.id))
      .limit(limit);
    return response;
  }
}

export async function updateCourse(uuid: string, data: Course) {
  await db.update(courses).set(data).where(eq(courses.id, uuid));
  await redis.del("inquesta:courses:list");
  return true;
}

export async function deleteCourse(uuid: string) {
  await db.delete(courses).where(eq(courses.id, uuid));
  await redis.del("inquesta:courses:list");
  return true;
}

export async function getCourseInfo(id: string) {
  const result = await db
    .selectDistinct()
    .from(courses)
    .where(eq(courses.id, id));
  if (result !== undefined) {
    return result[0];
  }
  return null;
}

export async function enrollToCourse(access_token: string, courseID: string, transactionID: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token"
    }
  }

  const result = await db.selectDistinct().from(users).where(eq(users.id, accessToken.getSub()));
  if (result.length === 0) {
    return {
      success: false,
      message: "user not found"
    }
  }

  try {
    await db.insert(courseEnrollments).values({
      course_id: courseID,
      user_id: accessToken.getSub(),
      transaction_id: transactionID
    })

    return {
      success: true,
      message: "record added successfully"
    }
  } catch (error) {
    return {
      success: false,
      message: "failed to add record"
    }
  }
}
