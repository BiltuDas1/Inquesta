import { GOOGLE_CLIENT, isProduction } from "../config.ts";
import { builder, GQLResponse } from "../libraries/builder.ts";
import { googleLogin, loginUser, registerUser } from "../resolvers/user.ts";
import { UserRoleObject, type User, type UserRole } from "../types/user.ts";
import { set_cookie } from "../utils/cookie.ts";
import { JWT } from "../utils/jwt/jwt.ts";

builder.mutationField("register", (t) =>
  t.field({
    type: GQLResponse,
    args: {
      firstname: t.arg.string({ required: true }),
      lastname: t.arg.string({ required: false }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_parent, data: User, context) => {
      try {
        return await registerUser(data);
      } catch (error: any) {
        context.logger.error(error, "Registration Failed");
        return {
          success: false,
          message: "internal server error",
        };
      }
    },
  }),
);

const loginResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: UserRole;
  }>("LoginResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: UserRoleObject,
        nullable: true,
      }),
    }),
  });

builder.queryField("login", (t) =>
  t.field({
    type: loginResponse,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_parent, { email, password }, context) => {
      const result = await loginUser(email, password);

      if (result === false) {
        return {
          success: false,
          message: "login failed",
        };
      }

      // Passing Cookies via HTTP Response
      context.reply.header("set-cookie", set_cookie({
          name: "access_token",
          value: result.jwt.accessToken.getToken(),
          expires: result.jwt.accessToken.expiryTime(),
          path: "/",
          samesite: "Lax",
          httponly: true,
          secure: isProduction
        })
      );

      context.reply.header("set-cookie", set_cookie({
          name: "refresh_token",
          value: result.jwt.refreshToken.getToken(),
          expires: result.jwt.refreshToken.expiryTime(),
          path: "/",
          samesite: "Strict",
          httponly: true,
          secure: isProduction
        })
      );

      context.reply.header("Set-Login", "logged-in");

      return {
        success: true,
        message: "login successful",
        data: result.role,
      };
    },
  }),
);

builder.mutationField("loginWithGoogle", (t) => 
  t.field({
    type: GQLResponse,
    args: {
      code: t.arg.string({ required: true })
    },
    resolve: async (_parent, { code }, context) => {
      const { tokens } = await GOOGLE_CLIENT.getToken(code);
      if (tokens.id_token === undefined || tokens.id_token === null) {
        return {
          success: false,
          message: "Unable to get access token from Google side"
        }
      }

      const ticket = await GOOGLE_CLIENT.verifyIdToken({
        idToken: tokens.id_token
      });

      const payload = ticket.getPayload();
      if (payload === undefined) {
        return {
          success: false,
          message: "No payload received from Google"
        }
      }

      const result = await googleLogin(payload)
      if (!(result instanceof JWT)) {
        return result;
      }

      // Passing Cookies via HTTP Response
      context.reply.header("set-cookie", set_cookie({
          name: "access_token",
          value: result.accessToken.getToken(),
          expires: result.accessToken.expiryTime(),
          path: "/",
          samesite: "Lax",
          httponly: true,
          secure: isProduction
        })
      );

      context.reply.header("set-cookie", set_cookie({
          name: "refresh_token",
          value: result.refreshToken.getToken(),
          expires: result.refreshToken.expiryTime(),
          path: "/",
          samesite: "Strict",
          httponly: true,
          secure: isProduction
        })
      );

      context.reply.header("Set-Login", "logged-in");

      return {
        success: true,
        message: "login successful"
      }
    }
  }),
);
