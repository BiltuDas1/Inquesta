import { hash, verify } from "argon2";
import { db } from "../config.ts";
import { users } from "../databases/schema.ts";
import type { User } from "../types/user.ts";
import { and, eq } from "drizzle-orm";

export async function registerUser(data: User) {
  data.password = await hash(data.password);
  await db.insert(users).values(data);
  return true;
}

export async function loginUser(email: string, password: string) {
  const [userRecord] = await db
    .selectDistinct({ password: users.password })
    .from(users)
    .where(and(eq(users.isActive, true), eq(users.email, email)))
    .limit(1);

  console.log(userRecord?.password);

  if (!userRecord) {
    return false;
  }

  const isCorrect = await verify(userRecord.password, password);
  return isCorrect;
}
