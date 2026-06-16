import { eq } from "drizzle-orm";
import { db } from "../config.ts";
import { curriculum_units, course_takeaways } from "../databases/schema.ts";

export async function getCurriculumUnits(courseId: string) {
  return await db
    .select()
    .from(curriculum_units)
    .where(eq(curriculum_units.courseId, courseId));
}

export async function addCurriculumUnit(courseId: string, title: string, description?: string) {
  await db.insert(curriculum_units).values({
    courseId,
    title,
    description,
    completed: false,
  });
  return true;
}

export async function updateCurriculumUnit(id: string, title: string, description?: string) {
  await db
    .update(curriculum_units)
    .set({ title, description })
    .where(eq(curriculum_units.id, id));
  return true;
}

export async function toggleCurriculumUnitComplete(id: string) {
  const current = await db
    .select({ completed: curriculum_units.completed })
    .from(curriculum_units)
    .where(eq(curriculum_units.id, id))
    .limit(1);

  const unit = current[0];
  if (!unit) {
    throw new Error("Unit not found");
  }

  await db
    .update(curriculum_units)
    .set({ completed: !unit.completed })
    .where(eq(curriculum_units.id, id));
  return true;
}

export async function deleteCurriculumUnit(id: string) {
  await db.delete(curriculum_units).where(eq(curriculum_units.id, id));
  return true;
}

export async function getCourseTakeaways(courseId: string) {
  return await db
    .select()
    .from(course_takeaways)
    .where(eq(course_takeaways.courseId, courseId));
}

export async function addCourseTakeaway(courseId: string, takeaway: string) {
  await db.insert(course_takeaways).values({
    courseId,
    takeaway,
  });
  return true;
}

export async function deleteCourseTakeaway(id: string) {
  await db.delete(course_takeaways).where(eq(course_takeaways.id, id));
  return true;
}
