import { and, eq, sql } from "drizzle-orm";
import { db } from "../config.ts";
import { assignments, courses, submissions, users, courseEnrollments, users_info } from "../databases/schema.ts";
import { JWT } from "../utils/jwt/jwt.ts";
import type { TeacherAssignmentInfo, AssignmentStudentDetail, StudentAssignmentInfo } from "../types/assignment.ts";

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

export async function getAssignmentSubmissions(access_token: string, assignmentId: string) {
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
    // 1. Verify assignment exists and is owned by this teacher
    const [assignment] = await db
      .select({ courseId: assignments.courseId })
      .from(assignments)
      .innerJoin(courses, eq(assignments.courseId, courses.id))
      .where(and(eq(assignments.id, assignmentId), eq(courses.teacherId, userId)))
      .limit(1);

    if (!assignment) {
      return {
        success: false,
        message: "Assignment not found or unauthorized.",
        data: null,
      };
    }

    // 2. Fetch enrolled students and their submissions
    const enrolledStudents = await db
      .select({
        studentId: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users_info.phone_number,
        phoneCc: users_info.phone_number_cc,
        submissionStatus: submissions.status,
        submissionScore: submissions.score,
      })
      .from(courseEnrollments)
      .innerJoin(users, eq(courseEnrollments.user_id, users.id))
      .leftJoin(users_info, eq(users.id, users_info.users_id))
      .leftJoin(submissions, and(
        eq(submissions.userId, users.id),
        eq(submissions.assignmentId, assignmentId)
      ))
      .where(eq(courseEnrollments.course_id, assignment.courseId));

    const data: AssignmentStudentDetail[] = enrolledStudents.map((row) => {
      let displayStatus = "not started";
      if (row.submissionStatus === "in_progress") {
        displayStatus = "in progress";
      } else if (row.submissionStatus === "completed") {
        displayStatus = "completed";
      }

      return {
        studentId: row.studentId,
        studentName: row.lastname ? `${row.firstname} ${row.lastname}` : row.firstname,
        studentEmail: row.email,
        studentPhone: row.phone,
        studentPhoneCountryCode: row.phoneCc,
        status: displayStatus,
        score: row.submissionScore ?? 0,
      };
    });

    return {
      success: true,
      message: "Assignment student details retrieved successfully",
      data,
    };
  } catch (error) {
    console.error("getAssignmentSubmissions error:", error);
    return {
      success: false,
      message: "Internal server error while fetching student submissions",
      data: null,
    };
  }
}

export async function updateStudentSubmission(
  access_token: string,
  assignmentId: string,
  studentId: string,
  data: {
    status?: string | undefined;
    score?: number | undefined;
  }
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return { success: false, message: "invalid access token" };
  }

  const userId = accessToken.getSub();

  try {
    // 1. Verify assignment exists and is owned by this teacher
    const [assignment] = await db
      .select({ courseId: assignments.courseId })
      .from(assignments)
      .innerJoin(courses, eq(assignments.courseId, courses.id))
      .where(and(eq(assignments.id, assignmentId), eq(courses.teacherId, userId)))
      .limit(1);

    if (!assignment) {
      return { success: false, message: "Assignment not found or unauthorized." };
    }

    // 2. Verify student is enrolled in this course
    const [enrollment] = await db
      .select({ id: courseEnrollments.id })
      .from(courseEnrollments)
      .where(and(eq(courseEnrollments.course_id, assignment.courseId), eq(courseEnrollments.user_id, studentId)))
      .limit(1);

    if (!enrollment) {
      return { success: false, message: "Student is not enrolled in this course." };
    }

    // 3. Map status value if provided
    let dbStatus: "not_started" | "in_progress" | "completed" | undefined = undefined;
    if (data.status !== undefined) {
      if (data.status === "not started") {
        dbStatus = "not_started";
      } else if (data.status === "in progress") {
        dbStatus = "in_progress";
      } else if (data.status === "completed") {
        dbStatus = "completed";
      } else {
        return { success: false, message: "Invalid status value. Allowed: 'not started', 'in progress', 'completed'" };
      }
    }

    // 4. Check if submission record already exists
    const [existingSubmission] = await db
      .select({ id: submissions.id })
      .from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.userId, studentId)))
      .limit(1);

    if (existingSubmission) {
      const updates: any = {};
      if (dbStatus !== undefined) updates.status = dbStatus;
      if (data.score !== undefined) updates.score = data.score;

      if (Object.keys(updates).length > 0) {
        await db.update(submissions).set(updates).where(eq(submissions.id, existingSubmission.id));
      }
    } else {
      await db.insert(submissions).values({
        assignmentId,
        userId: studentId,
        status: dbStatus ?? "not_started",
        score: data.score ?? 0,
      });
    }

    return { success: true, message: "Student progress/score updated successfully" };
  } catch (error) {
    console.error("updateStudentSubmission error:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function getStudentAssignments(access_token: string) {
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
    // Verify user exists
    const [userRecord] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRecord) {
      return {
        success: false,
        message: "User not found.",
        data: null,
      };
    }

    // Query all courses student is enrolled in, and get all assignments for those courses,
    // and left-join submissions for the logged-in student.
    const result = await db
      .select({
        assignmentId: assignments.id,
        courseName: courses.title,
        assignmentTitle: assignments.title,
        assignmentDescription: assignments.description,
        creationDate: assignments.createdAt,
        dueDate: assignments.dueDate,
        submissionStatus: submissions.status,
      })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courseEnrollments.course_id, courses.id))
      .innerJoin(assignments, eq(assignments.courseId, courses.id))
      .leftJoin(submissions, and(
        eq(submissions.assignmentId, assignments.id),
        eq(submissions.userId, userId)
      ))
      .where(eq(courseEnrollments.user_id, userId));

    const data: StudentAssignmentInfo[] = result.map((row) => {
      let displayStatus = "not started";
      if (row.submissionStatus === "in_progress") {
        displayStatus = "in progress";
      } else if (row.submissionStatus === "completed") {
        displayStatus = "completed";
      }

      return {
        id: row.assignmentId,
        courseName: row.courseName,
        assignmentTitle: row.assignmentTitle,
        assignmentDescription: row.assignmentDescription,
        creationDate: row.creationDate.toISOString(),
        dueDate: row.dueDate ? row.dueDate.toISOString() : null,
        status: displayStatus,
      };
    });

    return {
      success: true,
      message: "Student assignments retrieved successfully",
      data,
    };
  } catch (error) {
    console.error("getStudentAssignments error:", error);
    return {
      success: false,
      message: "Internal server error while fetching student assignments",
      data: null,
    };
  }
}

export async function updateStudentAssignmentStatus(
  access_token: string,
  assignmentId: string,
  status: string
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return { success: false, message: "invalid access token" };
  }

  const userId = accessToken.getSub();

  try {
    // 1. Verify assignment exists
    const [assignment] = await db
      .select({ courseId: assignments.courseId })
      .from(assignments)
      .where(eq(assignments.id, assignmentId))
      .limit(1);

    if (!assignment) {
      return { success: false, message: "Assignment not found." };
    }

    // 2. Verify student is enrolled in this course
    const [enrollment] = await db
      .select({ id: courseEnrollments.id })
      .from(courseEnrollments)
      .where(and(eq(courseEnrollments.course_id, assignment.courseId), eq(courseEnrollments.user_id, userId)))
      .limit(1);

    if (!enrollment) {
      return { success: false, message: "Student is not enrolled in this course." };
    }

    // 3. Map status value
    let dbStatus: "not_started" | "in_progress" | "completed";
    if (status === "not started") {
      dbStatus = "not_started";
    } else if (status === "in progress") {
      dbStatus = "in_progress";
    } else if (status === "completed") {
      dbStatus = "completed";
    } else {
      return { success: false, message: "Invalid status value. Allowed: 'not started', 'in progress', 'completed'" };
    }

    // 4. Check if submission record already exists
    const [existingSubmission] = await db
      .select({ id: submissions.id })
      .from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.userId, userId)))
      .limit(1);

    if (existingSubmission) {
      await db
        .update(submissions)
        .set({ status: dbStatus })
        .where(eq(submissions.id, existingSubmission.id));
    } else {
      await db.insert(submissions).values({
        assignmentId,
        userId: userId,
        status: dbStatus,
        score: 0,
      });
    }

    return { success: true, message: "Assignment status updated successfully" };
  } catch (error) {
    console.error("updateStudentAssignmentStatus error:", error);
    return { success: false, message: "Internal server error" };
  }
}
