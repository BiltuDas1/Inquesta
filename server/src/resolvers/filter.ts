import { max } from "drizzle-orm";
import { db } from "../config.ts";
import { courses, grades, levels } from "../databases/schema.ts";
import type { Filter } from "../types/filter.ts";

export async function getFilters(): Promise<Filter | null> {
  try {
    const gradeList = await db.select({ name: grades.name }).from(grades);
    const levelList = await db.select({ name: levels.name }).from(levels);

    // Dynamically compute the max price from actual courses
    const [maxPriceResult] = await db
      .select({ maxPrice: max(courses.price) })
      .from(courses);

    const data: Filter = {
      grades: [],
      levels: [],
      price: {
        maxPrice: maxPriceResult?.maxPrice ?? 0,
        minPrice: 0,
      },
    };

    for (const item of gradeList) {
      data.grades.push(item.name);
    }

    for (const item of levelList) {
      data.levels.push(item.name);
    }

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
