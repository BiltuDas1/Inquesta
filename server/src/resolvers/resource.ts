import { eq, and } from "drizzle-orm";
import { db } from "../config.ts";
import { courseResources } from "../databases/schema.ts";
import type { Resource } from "../types/resource.ts";

export async function getResources(courseId?: string | null) {
  if (courseId && courseId !== "all") {
    return await db
      .select()
      .from(courseResources)
      .where(eq(courseResources.courseId, courseId));
  }
  return await db.select().from(courseResources);
}

export async function addResource(data: {
  courseId?: string | null;
  title: string;
  type: string;
  url: string;
  description?: string | null;
}) {
  await db.insert(courseResources).values({
    courseId: data.courseId === "all" ? null : data.courseId,
    title: data.title,
    type: data.type,
    url: data.url,
    description: data.description,
  });
  return true;
}

export async function updateResource(
  id: string,
  data: {
    courseId?: string | null;
    title: string;
    type: string;
    url: string;
    description?: string | null;
  }
) {
  await db
    .update(courseResources)
    .set({
      courseId: data.courseId === "all" ? null : data.courseId,
      title: data.title,
      type: data.type,
      url: data.url,
      description: data.description,
    })
    .where(eq(courseResources.id, id));
  return true;
}

export async function deleteResource(id: string) {
  await db.delete(courseResources).where(eq(courseResources.id, id));
  return true;
}
