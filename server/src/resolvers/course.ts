import { eq } from "drizzle-orm";
import { db, redis } from "../config.ts";
import { courses } from "../databases/schema.ts";
import type { Course } from "../types/course.ts";

export async function addCourse(data: Course) {
  await db.insert(courses).values(data);
  await redis.del("inquesta:courses:list");
  return true;
}

export async function getCourse() {
  let result = await redis.get("inquesta:courses:list");
  if (result === null) {
    result = JSON.stringify(await db.select().from(courses));
    await redis.set("inquesta:courses:list", result);
  }

  return JSON.parse(result);
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
