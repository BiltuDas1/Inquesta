export const CourseLevels = ["beginner", "intermediate", "advanced"] as const;
export type CourseLevel = (typeof CourseLevels)[number];

export type Course = {
  title: string
  description?: string | null | undefined
  price: number
  level: CourseLevel
}
