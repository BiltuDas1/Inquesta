import { builder } from "../libraries/builder.ts";

export const CourseLevels = ["beginner", "intermediate", "advanced"] as const;
export type CourseLevel = (typeof CourseLevels)[number];

export type Course = {
  title: string;
  description?: string | null | undefined;
  price: number;
  level: CourseLevel;
  duration: string;
  instructorName: string;
};

export const CourseObject = builder.objectRef<Course>("Course").implement({
  fields: (t) => ({
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    price: t.exposeFloat("price"),
    level: t.exposeString("level"),
    duration: t.exposeString("duration"),
    instructorName: t.exposeString("instructorName"),
  }),
});
