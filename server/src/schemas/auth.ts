import { builder } from "../libraries/builder.ts";
import { loginUser, registerUser } from "../resolvers/user.ts";
import type { User } from "../types/user.ts";

builder.mutationField("register", (t) =>
  t.string({
    args: {
      firstname: t.arg.string({ required: true }),
      lastname: t.arg.string({ required: false }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_parent, data: User, context) => {
      await registerUser(data);
      return "registration complete";
    },
  }),
);

builder.queryField("login", (t) =>
  t.string({
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_parent, { email, password }, context) => {
      const success = await loginUser(email, password);

      if (success) {
        return "login successful";
      } else {
        return "login failed";
      }
    },
  }),
);
