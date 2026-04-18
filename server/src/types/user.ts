import { builder } from "../libraries/builder.ts";

export type User = {
  firstname: string;
  lastname?: string | null | undefined;
  email: string;
  password: string;
};

export type UserRole = {
  email: string;
  role: string;
  access_token: string;
  refresh_token: string;
};

export const UserRoleObject = builder
  .objectRef<UserRole>("UserRole")
  .implement({
    fields: (t) => ({
      email: t.exposeString("email"),
      role: t.exposeString("role"),
      refresh_token: t.exposeString("refresh_token"),
      access_token: t.exposeString("access_token"),
    }),
  });
