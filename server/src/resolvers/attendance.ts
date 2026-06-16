import { db } from "../config.ts";
import { attendance, courses, courseEnrollments, users } from "../databases/schema.ts";
import { and, eq, desc } from "drizzle-orm";
import { JWT } from "../utils/jwt/jwt.ts";

export interface AttendanceRecordInput {
  userId: string;
  status: string;
}

export async function getTeacherCourses(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
      data: [],
    };
  }

  try {
    const teacherId = accessToken.getSub();
    const data = await db
      .select()
      .from(courses)
      .where(eq(courses.teacherId, teacherId));

    return {
      success: true,
      message: "teacher courses retrieved successfully",
      data,
    };
  } catch (error) {
    console.error("Error retrieving teacher courses:", error);
    return {
      success: false,
      message: "internal server error",
      data: [],
    };
  }
}

export async function getCourseStudents(access_token: string, courseId: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
      data: [],
    };
  }

  try {
    const teacherId = accessToken.getSub();
    // Validate course ownership
    const courseCheck = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.teacherId, teacherId)))
      .limit(1);

    if (courseCheck.length === 0) {
      return {
        success: false,
        message: "Unauthorized or course not found",
        data: [],
      };
    }

    const enrolled = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
      })
      .from(courseEnrollments)
      .innerJoin(users, eq(courseEnrollments.user_id, users.id))
      .where(eq(courseEnrollments.course_id, courseId));

    return {
      success: true,
      message: "course students retrieved successfully",
      data: enrolled,
    };
  } catch (error) {
    console.error("Error retrieving course students:", error);
    return {
      success: false,
      message: "internal server error",
      data: [],
    };
  }
}

export async function submitAttendance(
  access_token: string,
  courseId: string,
  date: string,
  records: AttendanceRecordInput[],
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
    };
  }

  try {
    const teacherId = accessToken.getSub();
    // Validate course ownership
    const courseCheck = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.teacherId, teacherId)))
      .limit(1);

    if (courseCheck.length === 0) {
      return {
        success: false,
        message: "Unauthorized or course not found",
      };
    }

    for (const rec of records) {
      const existing = await db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.courseId, courseId),
            eq(attendance.userId, rec.userId),
            eq(attendance.date, date),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(attendance)
          .set({ status: rec.status, markedAt: new Date() })
          .where(eq(attendance.id, existing[0].id));
      } else {
        await db.insert(attendance).values({
          courseId,
          userId: rec.userId,
          date,
          status: rec.status,
        });
      }
    }

    return {
      success: true,
      message: "attendance submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting attendance:", error);
    return {
      success: false,
      message: "internal server error",
    };
  }
}

export async function getAttendanceLogs(access_token: string, courseId: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
      data: [],
    };
  }

  try {
    const teacherId = accessToken.getSub();
    const courseCheck = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.teacherId, teacherId)))
      .limit(1);

    if (courseCheck.length === 0) {
      return {
        success: false,
        message: "Unauthorized or course not found",
        data: [],
      };
    }

    const allRecords = await db
      .select()
      .from(attendance)
      .where(eq(attendance.courseId, courseId))
      .orderBy(desc(attendance.date));

    const grouped: Record<string, { date: string; presentCount: number; totalCount: number }> = {};
    for (const rec of allRecords) {
      if (!grouped[rec.date]) {
        grouped[rec.date] = { date: rec.date, presentCount: 0, totalCount: 0 };
      }
      grouped[rec.date].totalCount++;
      if (rec.status === "Present" || rec.status === "Late") {
        grouped[rec.date].presentCount++;
      }
    }

    return {
      success: true,
      message: "attendance logs retrieved successfully",
      data: Object.values(grouped),
    };
  } catch (error) {
    console.error("Error retrieving attendance logs:", error);
    return {
      success: false,
      message: "internal server error",
      data: [],
    };
  }
}

export async function getStudentAttendance(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
      data: [],
    };
  }

  try {
    const studentId = accessToken.getSub();
    const result = await db
      .select({
        id: attendance.id,
        courseId: attendance.courseId,
        date: attendance.date,
        status: attendance.status,
      })
      .from(attendance)
      .where(eq(attendance.userId, studentId));

    return {
      success: true,
      message: "Student attendance records retrieved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error retrieving student attendance:", error);
    return {
      success: false,
      message: "internal server error",
      data: [],
    };
  }
}
