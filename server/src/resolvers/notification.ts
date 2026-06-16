import { db } from "../config.ts";
import { notification, users } from "../databases/schema.ts";
import { JWT } from "../utils/jwt/jwt.ts";
import { or, and, eq, isNull, desc } from "drizzle-orm";

export async function notificationSend(title: string, description: string, role: string | null = "admin") {
  try {
    await db.insert(notification).values({
      title: title,
      description: description,
      role: role,
    });
    return {
      success: true,
      message: "Notification sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send Notification",
    };
  }
}

export async function getAllNotification(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    const userId = accessToken.getSub();

    // Retrieve user role
    const userResult = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    const userRole = userResult[0]?.role || "student";

    const result = await db
      .select({
        title: notification.title,
        description: notification.description,
      })
      .from(notification)
      .where(
        or(
          eq(notification.userId, userId),
          and(
            isNull(notification.userId),
            or(isNull(notification.role), eq(notification.role, userRole))
          )
        )
      )
      .orderBy(desc(notification.addedAt));

    return {
      success: true,
      message: "Notifications fetched successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      message: "failed to fetch notification",
    };
  }
}
