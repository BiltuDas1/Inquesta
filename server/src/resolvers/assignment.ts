import { and, eq, sql } from "drizzle-orm";
import { db } from "../config.ts";
import { assignments, courses, submissions, users } from "../databases/schema.ts";
import { JWT } from "../utils/jwt/jwt.ts";
import type { TeacherAssignmentInfo } from "../types/assignment.ts";

export async function getTeacherAssignments(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
      data: null,
    };
  }

  const userId = accessToken.getSub();

  try {
    // 1. Verify user is a teacher
    const [userRecord] = await db
      .selectDistinct({ role: users.role })
      .from(users)
      .where(and(eq(users.id, userId), eq(users.role, "teacher")))
      .limit(1);

    if (!userRecord) {
      return {
        success: false,
        message: "Unauthorized: User is not a teacher.",
        data: null,
      };
    }

    // 2. Fetch assignments with course name and submissions count
    const result = await db
      .select({
        id: assignments.id,
        courseName: courses.title,
        assignmentName: assignments.title,
        assignmentDescription: assignments.description,
        creationDate: assignments.createdAt,
        dueDate: assignments.dueDate,
        isPublished: assignments.isPublished,
        totalSubmission: sql<number>`count(${submissions.id})`,
      })
      .from(assignments)
      .innerJoin(courses, eq(assignments.courseId, courses.id))
      .leftJoin(submissions, eq(assignments.id, submissions.assignmentId))
      .where(eq(courses.teacherId, userId))
      .groupBy(
        assignments.id,
        courses.title,
        assignments.title,
        assignments.description,
        assignments.createdAt,
        assignments.dueDate,
        assignments.isPublished
      );

    const data: TeacherAssignmentInfo[] = result.map((row) => ({
      id: row.id,
      courseName: row.courseName,
      assignmentName: row.assignmentName,
      assignmentDescription: row.assignmentDescription,
      creationDate: row.creationDate.toISOString(),
      dueDate: row.dueDate ? row.dueDate.toISOString() : null,
      totalSubmission: Number(row.totalSubmission),
      isPublished: row.isPublished,
    }));

    return {
      success: true,
      message: "Assignments retrieved successfully",
      data,
    };
  } catch (error) {
    console.error("getTeacherAssignments error:", error);
    return {
      success: false,
      message: "Internal server error while fetching assignments",
      data: null,
    };
  }
}

export async function addAssignment(
  access_token: string,
  data: {
    courseId: string;
    title: string;
    description: string;
    dueDate?: string | null | undefined;
    isPublished?: boolean | undefined;
  }
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return { success: false, message: "invalid access token" };
  }

  const userId = accessToken.getSub();

  try {
    // Verify course belongs to this teacher
    const [course] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(and(eq(courses.id, data.courseId), eq(courses.teacherId, userId)))
      .limit(1);

    if (!course) {
      return { success: false, message: "Unauthorized: Course not found or not owned by you." };
    }

    await db.insert(assignments).values({
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      isPublished: data.isPublished ?? false,
    });

    return { success: true, message: "Assignment added successfully" };
  } catch (error) {
    console.error("addAssignment error:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function updateAssignment(
  access_token: string,
  id: string,
  data: {
    title?: string | undefined;
    description?: string | undefined;
    dueDate?: string | null | undefined;
    isPublished?: boolean | undefined;
  }
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return { success: false, message: "invalid access token" };
  }

  const userId = accessToken.getSub();

  try {
    // Verify assignment exists and is owned by this teacher
    const [assignment] = await db
      .select({
        id: assignments.id,
        isPublished: assignments.isPublished,
      })
      .from(assignments)
      .innerJoin(courses, eq(assignments.courseId, courses.id))
      .where(and(eq(assignments.id, id), eq(courses.teacherId, userId)))
      .limit(1);

    if (!assignment) {
      return { success: false, message: "Assignment not found or unauthorized." };
    }

    if (assignment.isPublished) {
      return { success: false, message: "Cannot update a published assignment" };
    }

    const updates: any = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.dueDate !== undefined) updates.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.isPublished !== undefined) updates.isPublished = data.isPublished;

    if (Object.keys(updates).length > 0) {
      await db.update(assignments).set(updates).where(eq(assignments.id, id));
    }

    return { success: true, message: "Assignment updated successfully" };
  } catch (error) {
    console.error("updateAssignment error:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function deleteAssignment(access_token: string, id: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return { success: false, message: "invalid access token" };
  }

  const userId = accessToken.getSub();

  try {
    // Verify assignment exists and is owned by this teacher
    const [assignment] = await db
      .select({ id: assignments.id })
      .from(assignments)
      .innerJoin(courses, eq(assignments.courseId, courses.id))
      .where(and(eq(assignments.id, id), eq(courses.teacherId, userId)))
      .limit(1);

    if (!assignment) {
      return { success: false, message: "Assignment not found or unauthorized." };
    }

    await db.delete(assignments).where(eq(assignments.id, id));

    return { success: true, message: "Assignment deleted successfully" };
  } catch (error) {
    console.error("deleteAssignment error:", error);
    return { success: false, message: "Internal server error" };
  }
}
