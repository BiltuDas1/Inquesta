import { mysqlTable, varchar, boolean } from "drizzle-orm/mysql-core";
import { uuidv7 } from "uuidv7";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  firstname: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }),
  email: varchar({ length: 320 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(false),
});
