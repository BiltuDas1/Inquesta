import { eq } from "drizzle-orm";
import { db, s3PublicEndpoint } from "../config.ts";
import { notices } from "../databases/schema.ts";
import type { Notice } from "../types/notice.ts";

export async function addNotice(data: Notice) {
  try {
    await db.insert(notices).values(data);
    return {
      success: true,
      message: "notice created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to create notice",
    };
  }
}

export async function updateNotice(id: string, data: Notice) {
  try {
    await db.update(notices).set(data).where(eq(notices.id, id));
    return {
      success: true,
      message: "notice updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to update notice information",
    };
  }
}

export async function deleteNotice(id: string) {
  try {
    await db.delete(notices).where(eq(notices.id, id));
    return {
      success: true,
      message: "notice deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to delete notice",
    };
  }
}

export async function getNotices() {
  const result = await db.select().from(notices);
  const data = [];
  for (const notice of result) {
    data.push({
      ...notice,
      imagePath: `${s3PublicEndpoint}${notice.imagePath}`,
    });
  }
  return data;
}
