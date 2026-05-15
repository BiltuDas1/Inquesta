import { db } from "../config.ts";
import { notices } from "../databases/schema.ts";
import type { Notice } from "../types/notice.ts";

export async function addNotice(data: Notice) {
  try {
    await db.insert(notices).values(data);
    return {
      success: true,
      message: "notice added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to add notice",
    };
  }
}
