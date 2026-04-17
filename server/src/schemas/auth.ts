import { builder, GQLResponse } from "../libraries/builder.ts";
import { loginUser, registerUser } from "../resolvers/user.ts";
import { UserRoleObject, type User, type UserRole } from "../types/user.ts";

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

      return {
        success: true,
        message: "login successful",
        data: result,
      };
    },
  }),
);
