import { inArray } from "drizzle-orm";
import { db } from "../config.ts";
import { filterSettings, grades, levels } from "../databases/schema.ts";
import type { Filter } from "../types/filter.ts";

export async function getFilters(): Promise<Filter | null> {
  try {
    const gradeList = await db.select({ name: grades.name }).from(grades);
    const levelList = await db.select({ name: levels.name }).from(levels);
    const prices = await db.select().from(filterSettings).where(inArray(filterSettings.key, ["minPrice", "maxPrice"]));
  
    const data: Filter = {
      grades: [],
      levels: [],
      price: {
        maxPrice: 0,
        minPrice: 0
      }
    }
  
    for (const item of gradeList) {
      data.grades.push(item.name)
    }
  
    for (const item of levelList) {
      data.levels.push(item.name)
    }
  
    for (const item of prices) {
      if (item.key === "minPrice" && item.value) {
        data.price.minPrice = +item.value
      }
  
      if (item.key === "maxPrice" && item.value) {
        data.price.maxPrice = +item.value
      }
    }
  
    return data;
  } catch (error) {
    console.log(error)
    return null;
  }
}