import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  int,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { uuidv7 } from "uuidv7";
import { CourseLevels } from "../types/course.ts";

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    firstname: varchar({ length: 255 }).notNull(),
    lastname: varchar({ length: 255 }),
    email: varchar({ length: 320 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(false),
    role: varchar({ length: 255 }).notNull().default("user"),
  },
  (table) => [index("active_status_idx").on(table.isActive)],
);

export const courses = mysqlTable("courses", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  price: int().notNull(),
  level: mysqlEnum("level", CourseLevels).notNull(),
  duration: varchar({ length: 255 }).notNull(),
  instructorName: varchar("instructor_name", { length: 255 }).notNull(),
});
