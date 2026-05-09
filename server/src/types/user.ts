import { builder } from "../libraries/builder.ts";

export type User = {
  firstname: string;
  lastname?: string | null | undefined;
  email: string;
  password: string;
};

export type UserRole = {
  firstname: string;
  lastname: string | null;
  email: string;
  role: string;
};

export type GoogleUser = {
  sub: string;
  email?: string;
  family_name?: string;
  given_name?: string;
  email_verified?: boolean;
};

export const UserRoleObject = builder
  .objectRef<UserRole>("UserRole")
  .implement({
    fields: (t) => ({
      firstname: t.exposeString("firstname"),
      lastname: t.exposeString("lastname"),
      email: t.exposeString("email"),
      role: t.exposeString("role"),
    }),
  });

export type UserInfo = {
  phone: string | null;
  whatsapp: string | null;
  phone_country_code: number | null;
  whatsapp_country_code: number | null;
  qualification: string | null;
};

export const UserInfoObject = builder
  .objectRef<UserInfo>("UserInfo")
  .implement({
    fields: (t) => ({
      phone: t.exposeString("phone"),
      phone_country_code: t.exposeInt("phone_country_code"),
      whatsapp: t.exposeString("whatsapp"),
      whatsapp_country_code: t.exposeInt("whatsapp_country_code"),
      qualification: t.exposeString("qualification"),
    }),
  });

export type UserDetails = {
  id: string;
  firstname: string;
  lastname?: string | null;
  email: string;
} & UserInfo;
