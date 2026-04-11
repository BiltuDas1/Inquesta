import { builder, GQLResponse } from "../libraries/builder.ts";
import { loginUser, registerUser } from "../resolvers/user.ts";
import type { User } from "../types/user.ts";

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
        await registerUser(data);
        return {
          success: true,
          message: "registration complete",
        };
      } catch (error) {
        return {
          success: false,
          message: "registration failed",
        };
      }
    },
  }),
);

builder.queryField("login", (t) =>
  t.field({
    type: GQLResponse,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_parent, { email, password }, context) => {
      const success = await loginUser(email, password);

      if (success) {
        return {
          success: true,
          message: "login successful",
        };
      } else {
        return {
          success: false,
          message: "login failed",
        };
      }
    },
  }),
);
