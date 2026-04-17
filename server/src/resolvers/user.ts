import { hash, verify } from "argon2";
import { db, emailObj, redis, templateObj } from "../config.ts";
import { users } from "../databases/schema.ts";
import { type UserRole, type User } from "../types/user.ts";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { generateUrlSafeToken } from "../utils/token.ts";
import { AccessToken } from "../utils/jwt/accessToken.ts";
import { RefreshToken } from "../utils/jwt/refreshToken.ts";
import { JWT } from "../utils/jwt/jwt.ts";

async function sendEmail(email: string, verify_link: string) {
  await emailObj.send_email({
    name: "noreply",
    sender_email: "onboarding@resend.dev",
    receiver_emails: [email],
    subject: "Verify your Email",
    html_body: templateObj.getTemplate({
      type: "magic-link",
      config: {
        target_email: email,
        verification_link: verify_link,
        expiry_minutes: 10,
      },
    }),
  });
}

export async function registerUser(data: User) {
  try {
    data.password = await hash(data.password);
    await db.insert(users).values(data);
    const token = generateUrlSafeToken();
    await redis.setEx("inquesta:user:email:" + data.email, 10 * 60, token); // Expire in 10 minutes
    await sendEmail(
      data.email,
      `https://inquesta.org/email/verify?token=${token}`
    );
    return {
      success: true,
      message: `An email has been sent to ${data.email}`,
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // Return if the email address already exist
    if (error.cause?.message.includes("Duplicate entry")) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserRole | false> {
  const [userRecord] = await db
  .selectDistinct({ id: users.id, password: users.password, role: users.role })
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

  // Generate tokens asynchronously
  const id = String(userRecord.id);
  const jwtObj=await JWT.init({id})
  const tokens=jwtObj.toObj()

  // Extract the actual token strings
  const accessToken = tokens.access_token;
  const refreshToken = tokens.refresh_token;

  return {
    email: email,
    role: userRecord.role,
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}
