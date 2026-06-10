import { builder } from "../libraries/builder.ts";
import type { UserDetails } from "./user.ts";

export const CourseLevels = ["beginner", "intermediate", "advanced"] as const;
export type CourseLevel = (typeof CourseLevels)[number];

export type Course = {
  title: string;
  description?: string | null | undefined;
  price: number;
  level: CourseLevel;
  duration: string;
  instructorName: string;
  iconName?: string | null | undefined;
  slug?: string;
  teacherId?: string | null | undefined;
};

export const CourseObject = builder
  .objectRef<Course & { id: string }>("Course")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      title: t.exposeString("title"),
      icon: t.exposeString("iconName"),
      description: t.exposeString("description", { nullable: true }),
      price: t.exposeFloat("price"),
      level: t.exposeString("level"),
      duration: t.exposeString("duration"),
      instructorName: t.exposeString("instructorName"),
      slug: t.exposeString("slug"),
      teacherId: t.exposeString("teacherId", { nullable: true }),
    }),
  });

export const CourseEnrolledObject = builder
  .objectRef<
    Course & {
      course_id: string;
      enrolled_at: number;
      transaction_id: string;
    } & UserDetails
  >("CourseEnrollment")
  .implement({
    fields: (t) => ({
      course_id: t.exposeString("course_id"),
      user_id: t.exposeString("id"),
      user_firstname: t.exposeString("firstname"),
      user_lastname: t.exposeString("lastname", { nullable: true }),
      user_email: t.exposeString("email"),
      course_title: t.exposeString("title"),
      course_icon: t.exposeString("iconName", { nullable: true }),
      course_description: t.exposeString("description", { nullable: true }),
      course_price: t.exposeFloat("price"),
      course_level: t.exposeString("level"),
      course_duration: t.exposeString("duration"),
      course_instructorName: t.exposeString("instructorName"),
      enrolled_at: t.exposeInt("enrolled_at"),
      transaction_id: t.exposeString("transaction_id"),
      user_phone_country_code: t.exposeInt("phone_country_code", {
        nullable: true,
      }),
      user_whatsapp_country_code: t.exposeInt("whatsapp_country_code", {
        nullable: true,
      }),
      user_phone_number: t.exposeString("phone", { nullable: true }),
      user_whatsapp_number: t.exposeString("whatsapp", { nullable: true }),
      user_qualification: t.exposeString("qualification", { nullable: true }),
      course_slug: t.exposeString("slug"),
    }),
  });

export const SearchableCourseObject = builder
  .objectRef<Course & { id: string; relevance: number }>("SearchableCourse")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      title: t.exposeString("title"),
      icon: t.exposeString("iconName"),
      description: t.exposeString("description", { nullable: true }),
      price: t.exposeFloat("price"),
      level: t.exposeString("level"),
      duration: t.exposeString("duration"),
      instructorName: t.exposeString("instructorName"),
      slug: t.exposeString("slug"),
      relevance: t.exposeFloat("relevance"),
    }),
  });
