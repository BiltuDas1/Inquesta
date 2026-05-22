import {
  mysqlTable,
  mysqlEnum,
  varchar,
  char,
  text,
  int,
  smallint,
  boolean,
  index,
  timestamp,
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
  iconName: varchar("icon_name", { length: 255 }),
  slug: varchar({ length: 255 }).notNull().unique(),
});

export const users_info = mysqlTable("users_info", {
  users_id: varchar("users_id", { length: 36 })
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  phone_number_cc: smallint({ unsigned: true }),
  phone_number: varchar({ length: 10 }),
  whatsapp_number_cc: smallint({ unsigned: true }),
  whatsapp_number: varchar({ length: 10 }),
  qualification: varchar({ length: 255 }),
});

export const countries = mysqlTable("countries", {
  code: smallint({ unsigned: true }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  iso_code: char({ length: 2 }).notNull(),
  currency_code: char({ length: 3 }).notNull(),
});

export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int().autoincrement().primaryKey(),
  course_id: varchar("courses_id", { length: 36 }).references(
    () => courses.id,
    { onDelete: "restrict" },
  ),
  user_id: varchar("user_id", { length: 36 }).references(() => users.id, {
    onDelete: "cascade",
  }),
  transaction_id: varchar("transaction_id", { length: 255 }).notNull().unique(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

export const notices = mysqlTable("notices", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  badge: varchar({ length: 255 }),
  imagePath: varchar("image_path", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(false),
});

export const hero_settings = mysqlTable("hero_settings", {
  key: varchar("key", { length: 50 }).primaryKey(),
  value: text("value"),
});
