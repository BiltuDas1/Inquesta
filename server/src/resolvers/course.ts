import { desc, eq, like, lte } from "drizzle-orm";
import { db, redis, s3PublicEndpoint } from "../config.ts";
import {
  courseEnrollments,
  courses,
  users,
  users_info,
} from "../databases/schema.ts";
import type { Course } from "../types/course.ts";
import { JWT } from "../utils/jwt/jwt.ts";
import type { UserDetails } from "../types/user.ts";
import { extract_url_number, sentence_to_url } from "../utils/slug.ts";

export async function addCourse(data: Course) {
  let slug = sentence_to_url(data.title, 5);
  const result = await db.select().from(courses).where(like(courses.slug, `${slug}%`)).orderBy(desc(courses.slug)).limit(1);
  for (const course of result) {
    const num = extract_url_number(course.slug)
    slug = `${slug}-${num + 1}`
  }

  await db.insert(courses).values({
    ...data,
    slug: slug
  });
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

    const data = []
    for (const item of response) {
      data.push({
        ...item,
        iconName: item.iconName ? `${s3PublicEndpoint}${item.iconName}` : null
      })
    }

    return data;
  } else {
    const response = await db
      .select()
      .from(courses)
      .orderBy(desc(courses.id))
      .limit(limit);

    const data = []
    for (const item of response) {
      data.push({
        ...item,
        iconName: item.iconName ? `${s3PublicEndpoint}${item.iconName}` : null
      })
    }

    return data;
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

export async function getCourseInfo(slug: string) {
  const result = await db
    .selectDistinct()
    .from(courses)
    .where(eq(courses.slug, slug));

  if (result !== undefined) {
    for (const item of result) {
      return {
        ...item,
        iconName: item.iconName ? `${s3PublicEndpoint}${item.iconName}` : null
      }
    }
  }
  return null;
}

export async function enrollToCourse(
  access_token: string,
  courseID: string,
  transactionID: string,
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  const result = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.id, accessToken.getSub()));
  if (result.length === 0) {
    return {
      success: false,
      message: "user not found",
    };
  }

  try {
    await db.insert(courseEnrollments).values({
      course_id: courseID,
      user_id: accessToken.getSub(),
      transaction_id: transactionID,
    });

    return {
      success: true,
      message: "record added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to add record",
    };
  }
}

export async function getAllEnrolledCourses(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    const result = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        price: courses.price,
        level: courses.level,
        duration: courses.duration,
        instructorName: courses.instructorName,
        iconName: courses.iconName,
      })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courseEnrollments.course_id, courses.id))
      .where(eq(courseEnrollments.user_id, accessToken.getSub()));

    return {
      success: true,
      message: "enrollment list fetched successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to read enrollment information from database",
    };
  }
}

export async function getAllEnrollments(access_token: string) {
  const accessToken = JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    const result = await db
      .select()
      .from(users)
      .innerJoin(courseEnrollments, eq(courseEnrollments.user_id, users.id))
      .innerJoin(courses, eq(courseEnrollments.course_id, courses.id))
      .leftJoin(users_info, eq(users.id, users_info.users_id));

    const data: (Course & {
      course_id: string;
      enrolled_at: number;
      transaction_id: string;
    } & UserDetails)[] = [];

    for (const item of result) {
      data.push({
        course_id: item.courses.id,
        id: item.users.id,
        firstname: item.users.firstname,
        lastname: item.users.lastname,
        email: item.users.email,
        title: item.courses.title,
        iconName: item.courses.iconName,
        description: item.courses.description,
        price: item.courses.price,
        level: item.courses.level,
        duration: item.courses.duration,
        instructorName: item.courses.instructorName,
        slug: item.courses.slug,
        enrolled_at: Math.floor(
          item.course_enrollments.enrolledAt.getTime() / 1000,
        ),
        transaction_id: item.course_enrollments.transaction_id,
        phone_country_code: item.users_info
          ? item.users_info.phone_number_cc
          : null,
        whatsapp_country_code: item.users_info
          ? item.users_info.whatsapp_number_cc
          : null,
        phone: item.users_info ? item.users_info.phone_number : null,
        whatsapp: item.users_info ? item.users_info.whatsapp_number : null,
        qualification: item.users_info ? item.users_info.qualification : null,
      });
    }

    return {
      success: true,
      message: "data fetched successfully",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to fetch enrollment details",
    };
  }
}
