import { isProduction } from "../config.ts";
import { builder, GQLResponse } from "../libraries/builder.ts";
import { loginUser, registerUser } from "../resolvers/user.ts";
import { UserRoleObject, type User, type UserRole } from "../types/user.ts";
import { set_cookie } from "../utils/cookie.ts";

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

      context.reply.header("set-login", "logged-in");

      return {
        success: true,
        message: "login successful",
        data: result.role,
      };
    },
  }),
);
