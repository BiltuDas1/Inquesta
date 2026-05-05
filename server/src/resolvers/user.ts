import { hash, verify } from "argon2";
import {
  db,
  emailObj,
  FRONTEND_FQDN,
  isProduction,
  redis,
  templateObj,
} from "../config.ts";
import { users, users_info } from "../databases/schema.ts";
import {
  type UserRole,
  type User,
  type GoogleUser,
  type UserInfo,
} from "../types/user.ts";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { generateUrlSafeToken } from "../utils/token.ts";
import { JWT } from "../utils/jwt/jwt.ts";
import type { FastifyContext } from "../types/fastify.ts";

async function sendEmail(email: string, verify_link: string) {
  const { error } = await emailObj.send_email({
    name: "noreply",
    sender_email: "noreply@inquesta.org",
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

  return error;
}

export async function registerUser(data: User, context: FastifyContext) {
  try {
    data.password = await hash(data.password);
    await db.insert(users).values(data);
    const token = generateUrlSafeToken();
    await redis.setEx("inquesta:user:email:" + token, 10 * 60, data.email); // Expire in 10 minutes
    const emailError = await sendEmail(
      data.email,
      (isProduction ? "https://" : "http://") +
        `${FRONTEND_FQDN}/email/verify?token=${token}`,
    );

    if (emailError !== null) {
      context.logger.error(emailError.message);
      return {
        success: false,
        message: "unable to send email",
      };
    }

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
  role: UserRole;
  jwt: JWT;
};

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

  await redis.set(
    "inquesta:user:jwt:" + jwtObj.refreshToken.getJti(),
    userRecord.id,
    {
      expiration: {
        type: "EXAT",
        value: jwtObj.refreshToken.expiryTime(),
      },
    },
  );

  return {
    role: {
      email: email,
      role: userRecord.role,
    },
    jwt: jwtObj,
  };
}

export async function googleLogin(payload: GoogleUser) {
  if (payload.given_name === undefined) {
    return {
      success: false,
      message: "`firstname` is not provided",
      role: null,
      jwt: null,
    };
  }

  if (payload.email === undefined) {
    return {
      success: false,
      message: "`email` is not provided",
      role: null,
      jwt: null,
    };
  }

  try {
    await db.insert(users).values({
      firstname: payload.given_name,
      lastname: payload.family_name,
      email: payload.email,
      password: await hash(generateUrlSafeToken()),
      isActive: true,
    });

    const result = await db
      .selectDistinct({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (result[0]?.id === undefined || result[0]?.role === undefined) {
      throw Error("Failed to insert data in database");
    }

    const jwtObj = await JWT.init(result[0].id);
    await redis.set(
      "inquesta:user:jwt:" + jwtObj.refreshToken.getJti(),
      result[0]?.id,
      {
        expiration: {
          type: "EXAT",
          value: jwtObj.refreshToken.expiryTime(),
        },
      },
    );

    return {
      success: true,
      message: "login successful",
      role: {
        email: payload.email,
        role: result[0]?.role,
      },
      jwt: jwtObj,
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // Return if the email address already exist
    if (error.cause?.message.includes("Duplicate entry")) {
      const result = await db
        .selectDistinct({
          id: users.id,
          role: users.role,
        })
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1);

      if (result[0]?.id === undefined || result[0]?.role === undefined) {
        throw Error("Failed to read data from database");
      }

      const jwtObj = await JWT.init(result[0].id);
      await redis.set(
        "inquesta:user:jwt:" + jwtObj.refreshToken.getJti(),
        result[0]?.id,
        {
          expiration: {
            type: "EXAT",
            value: jwtObj.refreshToken.expiryTime(),
          },
        },
      );

      return {
        success: true,
        message: "login successful",
        role: {
          email: payload.email,
          role: result[0]?.role,
        },
        jwt: jwtObj,
      };
    }

    throw error;
  }
}

export async function verify_email(token: string) {
  const email = await redis.getDel("inquesta:user:email:" + token);
  if (email === null) {
    return {
      success: false,
      data: null,
    };
  }

  try {
    await db
      .update(users)
      .set({
        isActive: true,
      })
      .where(eq(users.email, email));

    return {
      success: true,
      data: {
        email: email,
      },
    };
  } catch (error) {
    throw error;
  }
}

export async function update_userinfo(access_token: string, info: UserInfo) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    await db.insert(users_info).values({
      users_id: accessToken.getSub(),
      phone_number_cc: info.phone_country_code,
      phone_number: info.phone,
      whatsapp_number_cc: info.whatsapp_country_code,
      whatsapp_number: info.whatsapp,
      qualification: info.qualification,
    });

    return {
      success: true,
      message: "data updated successfully",
    };
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw error;
    }

    // If entry already exist then update the row
    if (error.cause?.message.includes("Duplicate entry")) {
      try {
        await db
          .update(users_info)
          .set({
            phone_number_cc: info.phone_country_code,
            phone_number: info.phone,
            whatsapp_number_cc: info.whatsapp_country_code,
            whatsapp_number: info.whatsapp,
            qualification: info.qualification,
          })
          .where(eq(users_info.users_id, accessToken.getSub()));

        return {
          success: true,
          message: "data updated successfully",
        };
      } catch (error) {}
    }

    return {
      success: false,
      message: "failed to update data",
    };
  }
}

type UserInfoResponse = {
  success: boolean;
  message: string;
  data?: UserInfo;
};

export async function get_userinfo(
  access_token: string,
  context: FastifyContext,
): Promise<UserInfoResponse> {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access_token",
    };
  }

  try {
    const [user] = await db
      .selectDistinct()
      .from(users_info)
      .where(eq(users_info.users_id, accessToken.getSub()));

    if (!user) {
      return {
        success: false,
        message: "no records found",
      };
    }

    return {
      success: true,
      message: "data fetched successfully",
      data: {
        phone_country_code: user.phone_number_cc,
        phone: user.phone_number,
        whatsapp_country_code: user.whatsapp_number_cc,
        whatsapp: user.whatsapp_number,
        qualification: user.qualification,
      },
    };
  } catch (error) {
    context.logger.error("get_userinfo: " + error);
    throw error;
  }
}

export async function get_user_role(access_token: string) {
  const accessToken = await JWT.toAccessToken(access_token);
  if (accessToken === null) {
    return {
      success: false,
      message: "invalid access token",
    };
  }

  const result = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.id, accessToken.getSub()));
  if (result.length === 0) {
    return {
      success: false,
      message: "no record found",
    };
  }

  const userinfo = result[0];
  if (userinfo === undefined) {
    return {
      success: false,
      message: "no record found",
    };
  }

  return {
    success: true,
    message: "valid login",
    data: {
      firstname: userinfo.firstname,
      lastname: userinfo.lastname,
      role: userinfo.role,
    },
  };
}

export async function delete_refresh_token(refresh_token: string) {
  await redis.del(refresh_token);
}
