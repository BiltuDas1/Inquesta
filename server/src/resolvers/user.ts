import { hash, verify } from "argon2";
import { db, emailObj, templateObj } from "../config.ts";
import { users } from "../databases/schema.ts";
import { type UserRole, type User } from "../types/user.ts";
import { and, DrizzleQueryError, eq } from "drizzle-orm";

async function sendEmail(email: string, verify_link: string) {
  await emailObj.send_email({
    name: "noreply",
    sender_email: "noreply@inquesta.org",
    receiver_emails: [email],
    subject: "Verify your Email",
    html_body: templateObj.getTemplate({
      type: "magic-link",
      config: {
        "target_email": email,
        "verification_link": verify_link
      }
    })
  })
}

export async function registerUser(data: User) {
  try {
    data.password = await hash(data.password);
    await db.insert(users).values(data);
    return {
      success: true,
      message: "Registration Complete"
    }
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // Return if the email address already exist
    if (error.cause?.message.includes("Duplicate entry")) {
      return {
        success: false,
        message: "Email already registered"
      };      
    }

    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<UserRole | false> {
  const [userRecord] = await db
    .selectDistinct({ password: users.password, role: users.role })
    .from(users)
    .where(and(eq(users.isActive, true), eq(users.email, email)))
    .limit(1);

  if (!userRecord) {
    return false;
  }

  const isCorrect = await verify(userRecord.password, password);
  if (!isCorrect) {
    return false;
  }

  return {
    email: email,
    role: userRecord.role,
  };
}
