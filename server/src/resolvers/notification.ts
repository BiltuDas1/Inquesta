import { db } from "../config.ts";
import { notification } from "../databases/schema.ts";
import { JWT } from "../utils/jwt/jwt.ts";

export async function notificationSend(title: string, description: string) {
  try {
    await db.insert(notification).values({
      title: title,
      description: description,
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
    const result = await db
      .select({
        title: notification.title,
        description: notification.description,
      })
      .from(notification);

    return {
      success: true,
      message: "Notifications fetched successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "failed to fetch notification",
    };
  }
}
