import { eq } from "drizzle-orm";
import { db } from "../config.ts";
import { courses } from "../databases/schema.ts";
import type { Course } from "../types/course.ts";

export async function addCourse(data: Course) {
  await db.insert(courses).values(data);
  return true;
}

export async function getCourse() {
  return await db.select().from(courses);
}

export async function updateCourse(uuid: string, data: Course) {
  await db.update(courses).set(data).where(eq(courses.id, uuid));
  return true;
}

export async function deleteCourse(uuid: string) {
  await db.delete(courses).where(eq(courses.id, uuid));
  return true;
}
