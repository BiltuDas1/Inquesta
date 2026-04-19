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
};

export type GoogleUser = {
  sub: string;
  email?: string;
  family_name?: string;
  given_name?: string;
  email_verified?: boolean;
}

export const UserRoleObject = builder
  .objectRef<UserRole>("UserRole")
  .implement({
    fields: (t) => ({
      email: t.exposeString("email"),
      role: t.exposeString("role")
    }),
  });
