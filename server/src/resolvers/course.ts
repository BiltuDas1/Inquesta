import { db } from "../config.ts";
import { courses } from "../databases/schema.ts";
import type { Course } from "../types/course.ts";

export async function addCourse(data: Course) {
  await db.insert(courses).values(data);
  return true;
}
