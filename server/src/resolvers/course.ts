import { desc, eq, lte } from "drizzle-orm";
import { db, redis, s3PublicEndpoint } from "../config.ts";
import { courses } from "../databases/schema.ts";
import type { Course } from "../types/course.ts";

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
