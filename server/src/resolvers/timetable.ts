import { db } from "../config.ts";
import { timetable_entries } from "../databases/schema.ts";
import { and, eq } from "drizzle-orm";
import { JWT } from "../utils/jwt/jwt.ts";

export interface AddTimetableInput {
  subject: string;
  day: string;
  startHour: number;
  durationHours?: number | null | undefined;
  room?: string | null | undefined;
  colorClass?: string | null | undefined;
  eventType?: string | null | undefined;
}

export async function getTimetableEntries(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
      data: [],
    };
  }

  try {
    const userId = accessToken.getSub();
    const data = await db
      .select()
      .from(timetable_entries)
      .where(eq(timetable_entries.userId, userId));

    return {
      success: true,
      message: "timetable entries retrieved successfully",
      data,
    };
  } catch (error) {
    console.error("Error retrieving timetable entries:", error);
    return {
      success: false,
      message: "internal server error",
      data: [],
    };
  }
}

export async function addTimetableEntry(
  access_token: string,
  input: AddTimetableInput,
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
    };
  }

  try {
    const userId = accessToken.getSub();
    await db.insert(timetable_entries).values({
      userId,
      subject: input.subject,
      day: input.day,
      startHour: input.startHour,
      durationHours: input.durationHours ?? 1,
      room: input.room,
      colorClass: input.colorClass,
      eventType: input.eventType,
    });

    return {
      success: true,
      message: "timetable entry added successfully",
    };
  } catch (error) {
    console.error("Error adding timetable entry:", error);
    return {
      success: false,
      message: "internal server error",
    };
  }
}

export async function deleteTimetableEntry(
  access_token: string,
  id: string,
) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
    };
  }

  try {
    const userId = accessToken.getSub();
    const result = await db
      .delete(timetable_entries)
      .where(
        and(
          eq(timetable_entries.id, id),
          eq(timetable_entries.userId, userId),
        ),
      );

    return {
      success: true,
      message: "timetable entry deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting timetable entry:", error);
    return {
      success: false,
      message: "internal server error",
    };
  }
}
