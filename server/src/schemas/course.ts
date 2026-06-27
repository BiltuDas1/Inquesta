import { builder, GQLResponse } from "../libraries/builder.ts";
import {
  addCourse,
  deleteCourse,
  enrollToCourse,
  getAllEnrolledCourses,
  getAllEnrollments,
  getCourseInfo,
  getCourses,
  searchCourses,
  updateCourse,
  getTeacherAllocatedCourses,
  verifyEnrollmentStatus,
} from "../resolvers/course.ts";
import { get_user_role } from "../resolvers/user.ts";
import {
  CourseEnrolledObject,
  CourseObject,
  SearchableCourseObject,
  GetTeacherAllocatedCoursesResponseObject,
  type Course,
  type CourseLevel,
} from "../types/course.ts";
import * as cookie from "cookie";
import type { UserDetails } from "../types/user.ts";

builder.mutationField("courseAdd", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      price: t.arg.int({ required: true }),
      level: t.arg.string({ required: true }),
      duration: t.arg.string({ required: true }),
      instructor_name: t.arg.string({ required: true }),
      icon_name: t.arg.string({ required: false }),
      teacher_id: t.arg.string({ required: false }),
      status: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "failed to add course",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "failed to add course",
        };
      }

      const userRole = await get_user_role(cookieObj["access_token"]);
      if (!userRole.success || !userRole.data || (userRole.data.role !== "admin" && userRole.data.role !== "teacher")) {
        return {
          success: false,
          message: "failed to add course",
        };
      }

      if (!args.title || args.title.trim() === "") {
        return {
          success: false,
          message: "Course title is required",
        };
      }

      if (args.price <= 0) {
        return {
          success: false,
          message: "Price must be greater than 0",
        };
      }

      if (args.level !== "Beginner" && args.level !== "Intermediate" && args.level !== "Advanced") {
        return {
          success: false,
          message: "Level must be Beginner, Intermediate, or Advanced",
        };
      }

      const durationRegex = /^\d+\s+(Month|Months|Week|Weeks|Day|Days)$/i;
      if (!args.duration || !durationRegex.test(args.duration)) {
        return {
          success: false,
          message: "Duration must be in a format like '3 Months', '12 Weeks', or '5 Days' (capitalized units)",
        };
      }

      const nameRegex = /^[a-zA-Z\s.,()]+$/;
      if (!args.instructor_name || !nameRegex.test(args.instructor_name)) {
        return {
          success: false,
          message: "Instructor name can only contain letters, spaces, dots, commas, and parentheses",
        };
      }

      const levelLower = args.level.toLowerCase();

      try {
        await addCourse({
          title: args.title,
          description: args.description,
          price: args.price,
          level: levelLower as CourseLevel,
          duration: args.duration,
          instructorName: args.instructor_name,
          iconName: args.icon_name,
          teacherId: args.teacher_id,
          status: args.status,
        });
        return {
          success: true,
          message: "course added successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "failed to add course",
        };
      }
    },
  }),
);

const courseResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: (Course & { id: string })[];
  }>("CourseResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [CourseObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("courseGet", (t) =>
  t.field({
    type: courseResponse,
    args: {
      lastID: t.arg.string({ required: false }),
      limit: t.arg.int({ required: true }),
      levels: t.arg.stringList({ required: false }),
      maxPrice: t.arg.int({ required: false }),
      status: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      try {
        const result: (Course & { id: string })[] = await getCourses(
          args.limit,
          args.lastID,
          args.levels,
          args.maxPrice,
          args.status,
        );

        return {
          success: true,
          message: "course list has been fetched successfully",
          data: result,
        };
      } catch (error) {
        console.error("Error fetching courses:", error);
        return {
          success: false,
          message: "unable to fetch courses list",
        };
      }
    },
  }),
);

builder.mutationField("courseDelete", (t) =>
  t.field({
    type: GQLResponse,
    authScopes: {
      isValidSession: true,
    },
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      try {
        await deleteCourse(args.id);
        return {
          success: true,
          message: "course deleted successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "failed to delete course",
        };
      }
    },
  }),
);

builder.mutationField("courseUpdate", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      price: t.arg.int({ required: true }),
      level: t.arg.string({ required: true }),
      duration: t.arg.string({ required: true }),
      instructor_name: t.arg.string({ required: true }),
      icon_name: t.arg.string({ required: false }),
      teacher_id: t.arg.string({ required: false }),
      status: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      const levelLower = args.level.toLowerCase();
      if (levelLower !== "beginner" && levelLower !== "intermediate" && levelLower !== "advanced") {
        return {
          success: false,
          message: "failed to update course details",
        };
      }

      try {
        await updateCourse(args.id, {
          title: args.title,
          description: args.description,
          price: args.price,
          level: levelLower as CourseLevel,
          duration: args.duration,
          instructorName: args.instructor_name,
          iconName: args.icon_name,
          teacherId: args.teacher_id,
          status: args.status,
        });
        return {
          success: true,
          message: "course details has been updated",
        };
      } catch (error) {
        return {
          success: false,
          message: "failed to update course details",
        };
      }
    },
  }),
);

const singleCourseResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: Course & { id: string };
  }>("SingleCourseResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: CourseObject,
        nullable: true,
      }),
    }),
  });

builder.queryField("getCourseInfo", (t) =>
  t.field({
    type: singleCourseResponse,
    args: {
      slug: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      try {
        const result = await getCourseInfo(args.slug);
        if (!result) {
          return {
            success: false,
            message: "course not found",
          };
        }

        return {
          success: true,
          message: "course information fetched successfully",
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message: "internal server error",
        };
      }
    },
  }),
);

builder.mutationField("enrollCourse", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseID: t.arg.string({ required: true }),
      transactionID: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
        };
      }

      return await enrollToCourse(
        cookieObj["access_token"],
        args.courseID,
        args.transactionID,
      );
    },
  }),
);

builder.queryField("enrolledCourses", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: courseResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
        };
      }

      return await getAllEnrolledCourses(cookieObj["access_token"]);
    },
  }),
);

const coursesResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: (Course & {
      course_id: string;
      enrolled_at: number;
      transaction_id: string;
      status: string;
    } & UserDetails)[];
  }>("CoursesResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [CourseEnrolledObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("getallEnrollments", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: coursesResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
        };
      }

      return await getAllEnrollments(cookieObj["access_token"]);
    },
  }),
);

const searchedCourseResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: (Course & { id: string; relevance: number })[];
  }>("SearchedCourseResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [SearchableCourseObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("searchCourses", (t) =>
  t.field({
    type: searchedCourseResponse,
    args: {
      text: t.arg.string({ required: true }),
      limit: t.arg.int({ required: true }),
      lastRelevance: t.arg.float({ required: false }),
      lastID: t.arg.string({ required: false }),
      levels: t.arg.stringList({ required: false }),
      maxPrice: t.arg.int({ required: false }),
      status: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      const result = await searchCourses(
        args.text,
        args.limit,
        args.lastID ? args.lastID : undefined,
        args.lastRelevance ? args.lastRelevance : undefined,
        args.levels,
        args.maxPrice,
        args.status,
      );
      return {
        success: true,
        message: "Course fetched successfully",
        data: result,
      };
    },
  }),
);

builder.queryField("getTeacherAllocatedCourses", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GetTeacherAllocatedCoursesResponseObject,
    resolve: async () => {
      return await getTeacherAllocatedCourses();
    },
  }),
);

builder.mutationField("verifyEnrollment", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      transactionID: t.arg.string({ required: true }),
      status: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
        };
      }

      if (args.status !== "verified" && args.status !== "rejected") {
        return {
          success: false,
          message: "Invalid status value. Must be 'verified' or 'rejected'.",
        };
      }

      return await verifyEnrollmentStatus(
        cookieObj["access_token"],
        args.transactionID,
        args.status as "verified" | "rejected",
      );
    },
  }),
);
