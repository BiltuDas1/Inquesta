import { hash } from "argon2";
import { db } from "../config.ts";
import { users } from "../databases/schema.ts";
import type { User } from "../types/user.ts";

export async function registerUser(data: User): Promise<boolean> {
  data.password = await hash(data.password);
  await db.insert(users).values(data);
  return true;
}
