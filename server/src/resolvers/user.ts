import { hash, verify } from "argon2";
import { db, emailObj, redis, templateObj } from "../config.ts";
import { users } from "../databases/schema.ts";
import { type UserRole, type User, type GoogleUser } from "../types/user.ts";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { generateUrlSafeToken } from "../utils/token.ts";
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
      `https://inquesta.org/email/verify?token=${token}`,
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

type LoginResponse = {
  role: UserRole,
  jwt: JWT
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse | false> {
  const [userRecord] = await db
    .selectDistinct({
      id: users.id,
      password: users.password,
      role: users.role,
    })
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

  const jwtObj = await JWT.init(userRecord.id);

  redis.set("inquesta:user:jwt:" + jwtObj.refreshToken.getJti(), userRecord.id, {
    expiration: {
      type: "EXAT",
      value: jwtObj.refreshToken.expiryTime()
    }
  });
  
  return {
    role: {
      email: email,
      role: userRecord.role
    },
    jwt: jwtObj
  };
}

export async function googleLogin(payload: GoogleUser) {
  if (payload.given_name === undefined) {
    return {
      success: false,
      message: "`firstname` is not provided"
    }
  }

  if (payload.email === undefined) {
    return {
      success: false,
      message: "`email` is not provided"
    }
  }

  try {
    await db.insert(users).values({
      firstname: payload.given_name,
      lastname: payload.family_name,
      email: payload.email,
      password: await hash(generateUrlSafeToken()),
      isActive: true
    })

    const result = await db.selectDistinct({
      id: users.id
    })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (result[0]?.id === undefined) {
      throw Error("Failed to insert data in database");
    }

    const jwtObj = await JWT.init(result[0].id);
    redis.set("inquesta:user:jwt:" + jwtObj.refreshToken.getJti(), result[0]?.id, {
      expiration: {
        type: "EXAT",
        value: jwtObj.refreshToken.expiryTime()
      }
    });

    return jwtObj
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // Return if the email address already exist
    if (error.cause?.message.includes("Duplicate entry")) {
      const result = await db.selectDistinct({
        id: users.id
      })
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1);

      if (result[0]?.id === undefined) {
        throw Error("Failed to read data from database");
      }

      const jwtObj = await JWT.init(result[0].id);
      redis.set("inquesta:user:jwt:" + jwtObj.refreshToken.getJti(), result[0]?.id, {
        expiration: {
          type: "EXAT",
          value: jwtObj.refreshToken.expiryTime()
        }
      });

      return jwtObj
    }

    throw error;
  }
}