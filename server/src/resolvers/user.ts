import { hash, verify } from "argon2";
import { db } from "../config.ts";
import { users } from "../databases/schema.ts";
import { type UserRole, type User } from "../types/user.ts";
import { and, eq } from "drizzle-orm";

export async function registerUser(data: User) {
  data.password = await hash(data.password);
  await db.insert(users).values(data);
  return true;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<UserRole | false> {
  const [userRecord] = await db
    .selectDistinct({ password: users.password, role: users.role })
    .from(users)
    .where(and(eq(users.isActive, true), eq(users.email, email)))
    .limit(1);

  if (!userRecord) {
    return false;
  }

  const isCorrect = await verify(userRecord.password, password);
  if (!isCorrect) {
    return false;
  }

  return {
    email: email,
    role: userRecord.role,
  };
}
