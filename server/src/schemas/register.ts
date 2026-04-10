import { builder } from "../libraries/builder.ts";
import { registerUser } from "../resolvers/register.ts";
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
