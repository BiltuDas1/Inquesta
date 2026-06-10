export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  duration: string;
  level: string;
  price: number;
  icon: string;
  slug: string;
  teacherId?: string | null;
}
