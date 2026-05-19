import { GOOGLE_CLIENT } from "../config.ts";
import { isProduction } from "../environment.ts";
import { builder, GQLResponse } from "../libraries/builder.ts";
import { refresh_jwt } from "../resolvers/refreshjwt.ts";
import {
  delete_refresh_token,
  get_user_role,
  get_userinfo,
  googleLogin,
  loginUser,
  registerUser,
  update_userinfo,
  verify_email,
} from "../resolvers/user.ts";
import {
  UserInfoObject,
  UserRoleObject,
  type User,
  type UserInfo,
  type UserRole,
} from "../types/user.ts";
import { set_cookie } from "../utils/cookie.ts";
import * as cookie from "cookie";

builder.mutationField("register", (t) =>
  t.field({
    type: GQLResponse,
    args: {
      firstname: t.arg.string({ required: true }),
      lastname: t.arg.string({ required: false }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      is_student: t.arg.boolean({ required: true }),
    },
    resolve: async (_parent, data, context) => {
      try {
        return await registerUser(data, data.is_student, context);
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

builder.mutationField("login", (t) =>
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
      context.reply.header(
        "set-cookie",
        set_cookie({
          name: "access_token",
          value: result.jwt.accessToken.getToken(),
          expires: result.jwt.accessToken.expiryTime(),
          path: "/",
          samesite: "Lax",
          httponly: true,
          secure: isProduction,
        }),
      );

      context.reply.header(
        "set-cookie",
        set_cookie({
          name: "refresh_token",
          value: result.jwt.refreshToken.getToken(),
          expires: result.jwt.refreshToken.expiryTime(),
          path: "/",
          samesite: "Strict",
          httponly: true,
          secure: isProduction,
        }),
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
    type: loginResponse,
    args: {
      code: t.arg.string({ required: true }),
    },
    resolve: async (_parent, { code }, context) => {
      try {
        const { tokens } = await GOOGLE_CLIENT.getToken(code);
        if (tokens.id_token === undefined || tokens.id_token === null) {
          return {
            success: false,
            message: "unable to get access token from Google side",
          };
        }

        const ticket = await GOOGLE_CLIENT.verifyIdToken({
          idToken: tokens.id_token,
        });

        const payload = ticket.getPayload();
        if (payload === undefined) {
          return {
            success: false,
            message: "no payload received from Google",
          };
        }

        const result = await googleLogin(payload);
        if (result.success === false) {
          return {
            success: false,
            message: result.message,
          };
        }

        if (result.jwt === null) {
          return {
            success: false,
            message: "unable to generate JWT",
          };
        }

        // Passing Cookies via HTTP Response
        context.reply.header(
          "set-cookie",
          set_cookie({
            name: "access_token",
            value: result.jwt.accessToken.getToken(),
            expires: result.jwt.accessToken.expiryTime(),
            path: "/",
            samesite: "Lax",
            httponly: true,
            secure: isProduction,
          }),
        );

        context.reply.header(
          "set-cookie",
          set_cookie({
            name: "refresh_token",
            value: result.jwt.refreshToken.getToken(),
            expires: result.jwt.refreshToken.expiryTime(),
            path: "/",
            samesite: "Strict",
            httponly: true,
            secure: isProduction,
          }),
        );

        context.reply.header("Set-Login", "logged-in");

        return {
          success: true,
          message: result.message,
          data: result.role,
        };
      } catch (error) {
        if (error instanceof Error && error.message === "invalid_grant") {
          return {
            success: false,
            message: "invalid or expired code",
          };
        }

        throw error;
      }
    },
  }),
);

builder.mutationField("refreshJWT", (t) =>
  t.field({
    type: GQLResponse,
    args: {},
    resolve: async (_parent, data, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["refresh_token"] === undefined) {
        return {
          success: false,
          message: "no refresh_token cookie",
        };
      }

      const response = await refresh_jwt(cookieObj["refresh_token"]);
      if (!response.success) {
        context.reply.header(
          "set-cookie",
          set_cookie({
            name: "access_token",
            value: "",
            expires: 0,
          }),
        );

        context.reply.header(
          "set-cookie",
          set_cookie({
            name: "refresh_token",
            value: "",
            expires: 0,
          }),
        );

        return {
          success: false,
          message: response.message,
        };
      }

      if (response.jwt === undefined) {
        return {
          success: false,
          message: "failed to generate JWT",
        };
      }

      // Passing Cookies via HTTP Response
      context.reply.header(
        "set-cookie",
        set_cookie({
          name: "access_token",
          value: response.jwt.accessToken.getToken(),
          expires: response.jwt.accessToken.expiryTime(),
          path: "/",
          samesite: "Lax",
          httponly: true,
          secure: isProduction,
        }),
      );

      context.reply.header(
        "set-cookie",
        set_cookie({
          name: "refresh_token",
          value: response.jwt.refreshToken.getToken(),
          expires: response.jwt.refreshToken.expiryTime(),
          path: "/",
          samesite: "Strict",
          httponly: true,
          secure: isProduction,
        }),
      );

      context.reply.header("Set-Login", "logged-in");

      return {
        success: true,
        message: "token refreshed successfully",
      };
    },
  }),
);

const verifyEmailResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: { email: string };
  }>("VerifyEmailResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.field({
        nullable: true,
        type: builder
          .objectRef<{ email: string }>("VerifyEmailData")
          .implement({
            fields: (tInner) => ({
              email: tInner.exposeString("email"),
            }),
          }),
        resolve: (parent) => parent.data,
      }),
    }),
  });

builder.mutationField("verifyEmail", (t) =>
  t.field({
    type: verifyEmailResponse,
    args: {
      token: t.arg.string({ required: true }),
    },
    resolve: async (_parent, { token }, context) => {
      const result = await verify_email(token);
      if (!result.success || result.data === null) {
        return {
          success: false,
          message: "invalid or expired token",
        };
      }

      return {
        success: true,
        message: "email verified successfully",
        data: {
          email: result.data.email,
        },
      };
    },
  }),
);

builder.mutationField("updateUserInfo", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      phone_number: t.arg.string(),
      whatsapp_number: t.arg.string(),
      phone_number_country_code: t.arg.int(),
      whatsapp_number_country_code: t.arg.int(),
      qualification: t.arg.string(),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
        };
      }

      const userinfo: UserInfo = {
        phone: args.phone_number === undefined ? null : args.phone_number,
        whatsapp:
          args.whatsapp_number === undefined ? null : args.whatsapp_number,
        phone_country_code:
          args.phone_number_country_code === undefined
            ? null
            : args.phone_number_country_code,
        whatsapp_country_code:
          args.whatsapp_number_country_code === undefined
            ? null
            : args.whatsapp_number_country_code,
        qualification:
          args.qualification === undefined ? null : args.qualification,
      };

      return await update_userinfo(cookieObj["access_token"], userinfo);
    },
  }),
);

const getUserInfoResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: UserInfo;
  }>("GetUserInfoResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: UserInfoObject,
        nullable: true,
      }),
    }),
  });

builder.queryField("getUserInfo", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: getUserInfoResponse,
    args: {},
    resolve: async (_parent, {}, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
        };
      }

      return await get_userinfo(cookieObj["access_token"], context);
    },
  }),
);

const UserLoginResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: { firstname: string; lastname: string | null; role: string };
  }>("UserLoginResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.field({
        nullable: true,
        type: builder
          .objectRef<{
            firstname: string;
            lastname: string | null;
            role: string;
          }>("UserLoginResponseData")
          .implement({
            fields: (tInner) => ({
              firstname: tInner.exposeString("firstname"),
              lastname: tInner.exposeString("lastname"),
              role: tInner.exposeString("role"),
            }),
          }),
        resolve: (parent) => parent.data,
      }),
    }),
  });

builder.queryField("isLoggedIn", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: UserLoginResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
        };
      }

      return await get_user_role(cookieObj["access_token"]);
    },
  }),
);

builder.mutationField("logoutUser", (t) =>
  t.field({
    type: GQLResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["refresh_token"] === undefined) {
        return {
          success: false,
          message: "no refresh_token cookie",
        };
      }

      await delete_refresh_token(cookieObj["refresh_token"]);

      // Passing Cookies via HTTP Response
      context.reply.header(
        "set-cookie",
        set_cookie({
          name: "access_token",
          value: "",
          expires: 0,
          path: "/",
          samesite: "Lax",
          httponly: true,
          secure: isProduction,
        }),
      );

      context.reply.header(
        "set-cookie",
        set_cookie({
          name: "refresh_token",
          value: "",
          expires: 0,
          path: "/",
          samesite: "Strict",
          httponly: true,
          secure: isProduction,
        }),
      );

      context.reply.header("Set-Login", "logged-out");

      return {
        success: true,
        message: "successfully logged out",
      };
    },
  }),
);
