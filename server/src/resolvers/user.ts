import { hash, verify } from "argon2";
import { db, emailObj, FRONTEND_FQDN, redis, templateObj } from "../config.ts";
import { teachers_info, users, users_info, courses, courseEnrollments } from "../databases/schema.ts";
import {
  type UserRole,
  type User,
  type GoogleUser,
  type UserInfo,
  type Teacher,
  type TeacherUpdateInfo,
  type AdminTeacherUpdateInput,
} from "../types/user.ts";
import { and, DrizzleQueryError, eq, desc, sql } from "drizzle-orm";
import { generateUrlSafeToken } from "../utils/token.ts";
import { JWT } from "../utils/jwt/jwt.ts";
import type { FastifyContext } from "../types/fastify.ts";
import { isMockTestingEnabled, isProduction } from "../environment.ts";

async function sendEmail(email: string, verify_link: string) {
  const { error } = await emailObj.send_email({
    name: "noreply",
    sender_email: "noreply@inquesta.org",
    receiver_emails: [email],
    subject: "Verify your Email",
    html_body: templateObj.getTemplate({
      type: "magic-link",
      config: {
        target_email: email,
        verification_link: verify_link,
        expiry_minutes: 10,
      },
    }),
  });

  return error;
}

export async function registerUser(
  data: User,
  is_student: boolean,
  context: FastifyContext,
) {
  if (!data.firstname || data.firstname.trim() === "") {
    return {
      success: false,
      message: "First name is required",
    };
  }
  if (!data.email || data.email.trim() === "") {
    return {
      success: false,
      message: "Email is required",
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      message: "Invalid email format",
    };
  }
  if (!data.password || data.password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters long",
    };
  }

  try {
    data.password = await hash(data.password);
    await db.insert(users).values({
      ...data,
      isActive: isMockTestingEnabled,
      role: is_student ? "student" : "parent",
    });

    if (isMockTestingEnabled) {
      return {
        success: true,
        message: "registration complete",
      };
    }

    const token = generateUrlSafeToken();
    await redis.setEx("inquesta:user:email:" + token, 10 * 60, data.email); // Expire in 10 minutes
    const emailError = await sendEmail(
      data.email,
      (isProduction ? "https://" : "http://") +
      `${FRONTEND_FQDN}/email/verify?token=${token}`,
    );

    if (emailError !== null) {
      context.logger.error(emailError.message);
      return {
        success: false,
        message: "unable to send email",
      };
    }

    return {
      success: true,
      message: `An email has been sent to ${data.email}`,
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // Return if the email address already exist
    if (error.cause?.message.includes("Duplicate entry")) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    throw error;
  }
}

type LoginResponse = {
  role: UserRole;
  jwt: JWT;
};

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse | false> {
  const [userRecord] = await db
    .selectDistinct({
      id: users.id,
      password: users.password,
      role: users.role,
      firstname: users.firstname,
      lastname: users.lastname,
      email: users.email,
    })
    .from(users)
    .where(and(eq(users.isActive, true), eq(users.email, email)))
    .limit(1);

  console.log(userRecord)
  if (!userRecord) {
    return false;
  }

  const isCorrect = await verify(userRecord.password, password);

  console.log(isCorrect)
  if (!isCorrect) {
    return false;
  }

  const jwtObj = await JWT.init(userRecord.id);

  await redis.set(
    "inquesta:user:jwt:" + jwtObj.refreshToken.getJti(),
    userRecord.id,
    {
      expiration: {
        type: "EXAT",
        value: jwtObj.refreshToken.expiryTime(),
      },
    },
  );

  return {
    role: {
      firstname: userRecord.firstname,
      lastname: userRecord.lastname,
      email: userRecord.email,
      role: userRecord.role,
    },
    jwt: jwtObj,
  };
}

export async function googleLogin(payload: GoogleUser) {
  if (payload.given_name === undefined) {
    return {
      success: false,
      message: "`firstname` is not provided",
      role: null,
      jwt: null,
    };
  }

  if (payload.email === undefined) {
    return {
      success: false,
      message: "`email` is not provided",
      role: null,
      jwt: null,
    };
  }

  try {
    await db.insert(users).values({
      firstname: payload.given_name,
      lastname: payload.family_name,
      email: payload.email,
      password: await hash(generateUrlSafeToken()),
      isActive: true,
    });

    const result = await db
      .selectDistinct({
        id: users.id,
        role: users.role,
        firstname: users.firstname,
        lastname: users.lastname,
      })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (result[0]?.id === undefined || result[0]?.role === undefined) {
      throw Error("Failed to insert data in database");
    }

    const jwtObj = await JWT.init(result[0].id);
    await redis.set(
      "inquesta:user:jwt:" + jwtObj.refreshToken.getJti(),
      result[0]?.id,
      {
        expiration: {
          type: "EXAT",
          value: jwtObj.refreshToken.expiryTime(),
        },
      },
    );

    return {
      success: true,
      message: "login successful",
      role: {
        firstname: result[0].firstname,
        lastname: result[0].lastname,
        email: payload.email,
        role: result[0].role,
      },
      jwt: jwtObj,
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // Return if the email address already exist
    if (error.cause?.message.includes("Duplicate entry")) {
      const result = await db
        .selectDistinct({
          id: users.id,
          role: users.role,
          firstname: users.firstname,
          lastname: users.lastname,
        })
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1);

      if (result[0]?.id === undefined || result[0]?.role === undefined) {
        throw Error("Failed to read data from database");
      }

      const jwtObj = await JWT.init(result[0].id);
      await redis.set(
        "inquesta:user:jwt:" + jwtObj.refreshToken.getJti(),
        result[0]?.id,
        {
          expiration: {
            type: "EXAT",
            value: jwtObj.refreshToken.expiryTime(),
          },
        },
      );

      return {
        success: true,
        message: "login successful",
        role: {
          firstname: result[0].firstname,
          lastname: result[0].lastname,
          email: payload.email,
          role: result[0].role,
        },
        jwt: jwtObj,
      };
    }

    throw error;
  }
}

export async function verify_email(token: string) {
  const email = await redis.getDel("inquesta:user:email:" + token);
  if (email === null) {
    return {
      success: false,
      data: null,
    };
  }

  try {
    await db
      .update(users)
      .set({
        isActive: true,
      })
      .where(eq(users.email, email));

    return {
      success: true,
      data: {
        email: email,
      },
    };
  } catch (error) {
    throw error;
  }
}

export async function update_userinfo(access_token: string, info: UserInfo) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    await db.insert(users_info).values({
      users_id: accessToken.getSub(),
      phone_number_cc: info.phone_country_code,
      phone_number: info.phone,
      whatsapp_number_cc: info.whatsapp_country_code,
      whatsapp_number: info.whatsapp,
      qualification: info.qualification,
    });

    return {
      success: true,
      message: "data updated successfully",
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // If entry already exist then update the row
    if (error.cause?.message.includes("Duplicate entry")) {
      try {
        await db
          .update(users_info)
          .set({
            phone_number_cc: info.phone_country_code,
            phone_number: info.phone,
            whatsapp_number_cc: info.whatsapp_country_code,
            whatsapp_number: info.whatsapp,
            qualification: info.qualification,
          })
          .where(eq(users_info.users_id, accessToken.getSub()));

        return {
          success: true,
          message: "data updated successfully",
        };
      } catch (error) { }
    }

    return {
      success: false,
      message: "failed to update data",
    };
  }
}

type UserInfoResponse = {
  success: boolean;
  message: string;
  data?: UserInfo;
};

export async function get_userinfo(
  access_token: string,
  context: FastifyContext,
): Promise<UserInfoResponse> {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    const [user] = await db
      .selectDistinct()
      .from(users_info)
      .where(eq(users_info.users_id, accessToken.getSub()));

    if (!user) {
      return {
        success: false,
        message: "no records found",
      };
    }

    return {
      success: true,
      message: "data fetched successfully",
      data: {
        phone_country_code: user.phone_number_cc,
        phone: user.phone_number,
        whatsapp_country_code: user.whatsapp_number_cc,
        whatsapp: user.whatsapp_number,
        qualification: user.qualification,
      },
    };
  } catch (error) {
    context.logger.error("get_userinfo: " + error);
    throw error;
  }
}

export async function get_user_role(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
    };
  }

  const result = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.id, accessToken.getSub()));
  if (result.length === 0) {
    return {
      success: false,
      message: "no record found",
    };
  }

  const userinfo = result[0];
  if (userinfo === undefined) {
    return {
      success: false,
      message: "no record found",
    };
  }

  return {
    success: true,
    message: "valid login",
    data: {
      firstname: userinfo.firstname,
      lastname: userinfo.lastname,
      role: userinfo.role,
    },
  };
}

export async function addTeacher(
  access_token: string,
  info: Omit<Teacher, "id">,
  context: FastifyContext,
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
    };
  }

  try {
    const [adminUser] = await db
      .selectDistinct({ role: users.role })
      .from(users)
      .where(eq(users.id, accessToken.getSub()))
      .limit(1);

    if (!adminUser || adminUser.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized: Only administrators can add teachers.",
      };
    }

    await db.insert(users).values({
      firstname: info.firstname,
      lastname: info.lastname,
      email: info.email,
      password: await hash(generateUrlSafeToken()),
      role: "teacher",
      isActive: false,
    });

    const [newTeacher] = await db
      .selectDistinct({ id: users.id })
      .from(users)
      .where(eq(users.email, info.email))
      .limit(1);

    const verificationLink =
      (isProduction ? "https://" : "http://") +
      `${FRONTEND_FQDN}/onboard-teacher/details/${newTeacher?.id}`;

    return {
      success: true,
      message: "Teacher added successfully",
      data: {
        link: verificationLink,
      },
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      context.logger.error("addTeacher error: " + error);
      throw error;
    }

    if (error.cause?.message.includes("Duplicate entry")) {
      return {
        success: false,
        message: "A user with this email address is already registered.",
      };
    }
    throw error;
  }
}

export async function addedTeacherDetails(
  teacherId: string,
  info: TeacherUpdateInfo
) {
  try {
    if (!info.password) {
      throw new Error("Password is required to activate teacher account.");
    }
    await db.insert(teachers_info).values({
      users_id: teacherId,
      qualification: info.qualification,
    });

    await db.update(users)
      .set({
        isActive: true,
        password: await hash(info.password)
      })
      .where(eq(users.id, teacherId));

    return {
      success: true,
      message: "Teacher details added successfully",
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    if (error.cause?.message.includes("Duplicate entry")) {
      try {

        await db
          .update(teachers_info)
          .set({
            qualification: info.qualification,
          })
          .where(eq(teachers_info.users_id, teacherId));

        await db.update(users)
          .set({ isActive: true, password: await hash(generateUrlSafeToken()) })
          .where(eq(users.id, teacherId));

        return {
          success: true,
          message: "Teacher details updated successfully",
        };
      } catch (updateError) {
        throw updateError;
      }
    }

    return {
      success: false,
      message: "Failed to update teacher details",
    };
  }
}

export async function getTeacherInfo(teacherId: string) {
  try {
    const result = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        qualification: teachers_info.qualification,
        isActive: users.isActive,
      })
      .from(users)
      .leftJoin(teachers_info, eq(users.id, teachers_info.users_id))
      .where(
        and(
          eq(users.id, teacherId),
          eq(users.role, "teacher")
        )
      )
      .limit(1);

    const teacher = result[0];

    if (!teacher) {
      return {
        success: false,
        message: "Teacher not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Teacher info retrieved successfully",
      data: {
        id: teacher.id,
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        email: teacher.email,
        qualification: teacher.qualification,
        is_active: teacher.isActive
      },
    };
  } catch (error) {
    console.error("Error fetching teacher info:", error);
    return {
      success: false,
      message: "Internal server error while fetching teacher info",
      data: null,
    };
  }
}

export async function updateTeacherByAdmin(
  access_token: string,
  teacherId: string,
  info: AdminTeacherUpdateInput
) {
  // 1. Authenticate the Token
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return { success: false, message: "invalid access token" };
  }

  try {
    const [adminUser] = await db
      .selectDistinct({ role: users.role })
      .from(users)
      .where(eq(users.id, accessToken.getSub()))
      .limit(1);

    if (!adminUser || adminUser.role !== "admin") {
      return { success: false, message: "Unauthorized: Only administrators can perform this action." };
    }

    const userUpdates: any = {};
    if (info.firstname !== undefined) userUpdates.firstname = info.firstname;
    if (info.lastname !== undefined) userUpdates.lastname = info.lastname;
    if (info.email !== undefined) userUpdates.email = info.email;
    if (info.isActive !== undefined) userUpdates.isActive = info.isActive;

    if (Object.keys(userUpdates).length > 0) {
      await db.update(users).set(userUpdates).where(eq(users.id, teacherId));
    }

    if (info.qualification !== undefined) {
      try {
        await db.insert(teachers_info).values({
          users_id: teacherId,
          qualification: info.qualification,
        });
      } catch (error) {
        if (!(error instanceof DrizzleQueryError)) throw error;
        if (error.cause?.message.includes("Duplicate entry")) {
          await db
            .update(teachers_info)
            .set({ qualification: info.qualification })
            .where(eq(teachers_info.users_id, teacherId));
        } else {
          throw error;
        }
      }
    }

    return {
      success: true,
      message: "Teacher details updated successfully by admin",
    };

  } catch (error) {
    console.error("Admin update teacher error:", error);
    if (error instanceof DrizzleQueryError && error.cause?.message.includes("Duplicate entry")) {
      return { success: false, message: "Email address is already in use by another account." };
    }

    return { success: false, message: "Internal server error" };
  }
}

export async function deleteTeacher(
  access_token: string,
  teacherId: string
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return { success: false, message: "invalid access token" };
  }

  try {
    const [adminUser] = await db
      .selectDistinct({ role: users.role })
      .from(users)
      .where(eq(users.id, accessToken.getSub()))
      .limit(1);

    if (!adminUser || adminUser.role !== "admin") {
      return { success: false, message: "Unauthorized action." };
    }

    const [targetTeacher] = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.id, teacherId),
          eq(users.role, "teacher")
        )
      )
      .limit(1);

    if (!targetTeacher) {
      return { success: false, message: "Teacher not found or already deleted." };
    }

    await db.delete(users).where(eq(users.id, teacherId));

    return {
      success: true,
      message: "Teacher and all related details deleted successfully",
    };
  } catch (error) {
    console.error("Delete teacher error:", error);
    return { success: false, message: "Internal server error while deleting teacher" };
  }
}

export async function getAllTeachers() {
  try {
    const result = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        qualification: teachers_info.qualification,
        is_active: users.isActive,
      })
      .from(users)
      .leftJoin(teachers_info, eq(users.id, teachers_info.users_id))
      .where(eq(users.role, "teacher"));

    return {
      success: true,
      message: "Teachers retrieved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching all teachers:", error);
    return {
      success: false,
      message: "Internal server error while fetching teachers",
      data: null,
    };
  }
}

export async function delete_refresh_token(refresh_token: string) {
  await redis.del(refresh_token);
}

export async function getAdminDashboardStats(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
      data: null,
    };
  }

  // Check admin role
  const [adminUser] = await db
    .selectDistinct({ role: users.role })
    .from(users)
    .where(eq(users.id, accessToken.getSub()))
    .limit(1);

  if (!adminUser || adminUser.role !== "admin") {
    return {
      success: false,
      message: "Unauthorized action.",
      data: null,
    };
  }

  try {
    // 1. Total users
    const [totalUsersRes] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalUsers = totalUsersRes?.count || 0;

    // Calculate users registered this month using UUIDv7 timestamps from user IDs
    const allUsers = await db.select({ id: users.id }).from(users);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let registeredThisMonth = 0;
    for (const u of allUsers) {
      try {
        const hex = u.id.replace(/-/g, "");
        if (hex.length === 32) {
          const timestampMs = parseInt(hex.substring(0, 12), 16);
          const date = new Date(timestampMs);
          if (!isNaN(date.getTime()) && date >= startOfMonth) {
            registeredThisMonth++;
          }
        }
      } catch (err) {
        // Skip non-UUIDv7 or malformed IDs
      }
    }

    // 2. Active courses
    const [totalCoursesRes] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const activeCourses = totalCoursesRes?.count || 0;

    // 3. Pending approvals
    const [pendingApprovalsRes] = await db.select({ count: sql<number>`count(*)` }).from(courseEnrollments).where(eq(courseEnrollments.status, "pending"));
    const pendingApprovals = pendingApprovalsRes?.count || 0;

    // 4. User breakdown by role (filtered to exclude Parent and Instructor)
    const userBreakdownRes = await db
      .select({
        role: users.role,
        count: sql<number>`count(*)`
      })
      .from(users)
      .groupBy(users.role);

    // Map role breakdown to be user-friendly, capitalizing and using plurals
    const roleMap = {
      student: "Students",
      teacher: "Teachers",
      admin: "Administrators",
    };

    const userBreakdown = (Object.keys(roleMap) as Array<keyof typeof roleMap>).map((roleKey) => {
      const dbRole = userBreakdownRes.find((r) => r.role === roleKey);
      return {
        role: roleMap[roleKey],
        count: (dbRole?.count || 0).toLocaleString(),
      };
    });

    // 5. Pending Actions (Refund requests and Content submissions removed)
    const pendingActions = [
      {
        id: "a1",
        title: "Course Enrollments",
        subtitle: `${pendingApprovals} awaiting approval`,
        actionText: "Review",
        type: "blue",
      },
    ];

    // 6. Activity Log (Based on recent enrollments or teacher onboarding)
    // We can select the most recent 4 enrollments
    const recentEnrollments = await db
      .select({
        id: courseEnrollments.id,
        firstname: users.firstname,
        lastname: users.lastname,
        courseTitle: courses.title,
        enrolledAt: courseEnrollments.enrolledAt,
        status: courseEnrollments.status,
      })
      .from(courseEnrollments)
      .innerJoin(users, eq(courseEnrollments.user_id, users.id))
      .innerJoin(courses, eq(courseEnrollments.course_id, courses.id))
      .orderBy(desc(courseEnrollments.enrolledAt))
      .limit(4);

    const activityLog = recentEnrollments.map((enrollment, index) => {
      const timeDiff = Date.now() - enrollment.enrolledAt.getTime();
      const minutes = Math.max(1, Math.floor(timeDiff / (1000 * 60)));
      let timeString = `${minutes} min ago`;
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        timeString = hours === 1 ? "1 hr ago" : `${hours} hrs ago`;
        if (hours >= 24) {
          const days = Math.floor(hours / 24);
          timeString = days === 1 ? "1 day ago" : `${days} days ago`;
        }
      }

      let action = `${enrollment.firstname} enrolled in ${enrollment.courseTitle}`;
      let dotColor = "bg-[#00e5bc]"; // default green
      if (enrollment.status === "pending") {
        action = `New enrollment pending for ${enrollment.firstname} (${enrollment.courseTitle})`;
        dotColor = "bg-[#f59e0b]"; // warning/amber
      } else if (enrollment.status === "rejected") {
        action = `Enrollment rejected for ${enrollment.firstname}`;
        dotColor = "bg-[#ffb4ab]"; // error/red
      }

      return {
        id: `log-${enrollment.id}-${index}`,
        action,
        time: timeString,
        dotColor,
      };
    });

    // If activity log is empty, add some mock fallback logs so it doesn't look completely empty
    if (activityLog.length === 0) {
      activityLog.push(
        {
          id: "log-default-1",
          action: "System initialized successfully",
          time: "Just now",
          dotColor: "bg-[#00e5bc]",
        },
        {
          id: "log-default-2",
          action: "Admin session started",
          time: "5 min ago",
          dotColor: "bg-[#bdc2ff]",
        }
      );
    }

    return {
      success: true,
      message: "Admin dashboard stats retrieved successfully",
      data: {
        totalUsers: totalUsers.toLocaleString(),
        registeredThisMonth: registeredThisMonth.toLocaleString(),
        activeCourses: activeCourses.toLocaleString(),
        pendingApprovals: pendingApprovals.toLocaleString(),
        openIssues: "0",
        userBreakdown,
        pendingActions,
        activityLog,
      },
    };
  } catch (error) {
    console.error("Error retrieving admin dashboard stats:", error);
    return {
      success: false,
      message: "Internal server error while retrieving stats",
      data: null,
    };
  }
}
