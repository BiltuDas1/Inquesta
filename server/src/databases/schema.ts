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
    role: varchar({ length: 255 }).notNull().default("student"),
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
  teacherId: varchar("teacher_id", { length: 36 }).references(() => users.id),
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
  status: mysqlEnum("status", ["pending", "verified", "rejected"]).notNull().default("pending"),
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

export const levels = mysqlTable("levels", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 50 }).unique().notNull(),
});

export const grades = mysqlTable("grades", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 50 }).unique().notNull(),
});

export const filterSettings = mysqlTable("filterSettings", {
  key: varchar("key", { length: 50 }).primaryKey(),
  value: text("value"),
});

export const cart = mysqlTable("cart", {
  id: int().autoincrement().primaryKey(),
  course_id: varchar("courses_id", { length: 36 }).references(
    () => courses.id,
    { onDelete: "restrict" },
  ),
  user_id: varchar("user_id", { length: 36 }).references(() => users.id, {
    onDelete: "cascade",
  }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const notification = mysqlTable("notification", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }),
  addedAt: timestamp("added_at").defaultNow().notNull()
});

export const teachers_info = mysqlTable("teachers_info", {
  users_id: varchar("users_id", { length: 36 })
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  qualification: varchar({ length: 255 }),
});

export const assignments = mysqlTable("assignments", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  courseId: varchar("course_id", { length: 36 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
  isPublished: boolean("is_published").notNull().default(false),
});

export const submissions = mysqlTable("submissions", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  assignmentId: varchar("assignment_id", { length: 36 })
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).notNull().default("not_started"),
  score: int().notNull().default(0),
});

export const timetable_entries = mysqlTable("timetable_entries", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  day: varchar("day", { length: 50 }).notNull(),
  startHour: int("start_hour").notNull(),
  durationHours: int("duration_hours").notNull().default(1),
  room: varchar("room", { length: 255 }),
  colorClass: varchar("color_class", { length: 255 }),
  eventType: varchar("event_type", { length: 50 }),
});

export const attendance = mysqlTable("attendance", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  courseId: varchar("course_id", { length: 36 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  markedAt: timestamp("marked_at").defaultNow().notNull(),
});

export const curriculum_units = mysqlTable("curriculum_units", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  courseId: varchar("course_id", { length: 36 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  completed: boolean().notNull().default(false),
});

export const course_takeaways = mysqlTable("course_takeaways", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  courseId: varchar("course_id", { length: 36 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  takeaway: text().notNull(),
});

