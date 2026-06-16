import { builder, GQLResponse } from "../libraries/builder.ts";
import * as cookie from "cookie";
import {
  getTeacherCourses,
  getCourseStudents,
  submitAttendance,
  getAttendanceLogs,
  getStudentAttendance,
} from "../resolvers/attendance.ts";

// Course representation in attendance context
interface AttendanceCourse {
  id: string;
  title: string;
  level: string;
}

const AttendanceCourseObject = builder
  .objectRef<AttendanceCourse>("AttendanceCourse")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      title: t.exposeString("title"),
      level: t.exposeString("level"),
    }),
  });

const TeacherCoursesResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: AttendanceCourse[];
  }>("TeacherCoursesResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [AttendanceCourseObject],
        nullable: true,
      }),
    }),
  });

// Student representation in attendance context
interface AttendanceStudent {
  id: string;
  firstname: string;
  lastname?: string | null;
  email: string;
}

const AttendanceStudentObject = builder
  .objectRef<AttendanceStudent>("AttendanceStudent")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      firstname: t.exposeString("firstname"),
      lastname: t.exposeString("lastname", { nullable: true }),
      email: t.exposeString("email"),
    }),
  });

const CourseStudentsResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: AttendanceStudent[];
  }>("CourseStudentsResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [AttendanceStudentObject],
        nullable: true,
      }),
    }),
  });

// Attendance record input
const AttendanceRecordInput = builder.inputType("AttendanceRecordInput", {
  fields: (t) => ({
    userId: t.string({ required: true }),
    status: t.string({ required: true }),
  }),
});

// Log representation
interface AttendanceLog {
  date: string;
  presentCount: number;
  totalCount: number;
}

const AttendanceLogObject = builder
  .objectRef<AttendanceLog>("AttendanceLog")
  .implement({
    fields: (t) => ({
      date: t.exposeString("date"),
      presentCount: t.exposeInt("presentCount"),
      totalCount: t.exposeInt("totalCount"),
    }),
  });

const AttendanceLogsResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: AttendanceLog[];
  }>("AttendanceLogsResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [AttendanceLogObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("getTeacherCourses", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: TeacherCoursesResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
          data: [],
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
          data: [],
        };
      }

      return await getTeacherCourses(cookieObj["access_token"]);
    },
  }),
);

builder.queryField("getCourseStudents", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: CourseStudentsResponse,
    args: {
      courseId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
          data: [],
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
          data: [],
        };
      }

      return await getCourseStudents(cookieObj["access_token"], args.courseId);
    },
  }),
);

builder.queryField("getAttendanceLogs", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: AttendanceLogsResponse,
    args: {
      courseId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
          data: [],
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
          data: [],
        };
      }

      return await getAttendanceLogs(cookieObj["access_token"], args.courseId);
    },
  }),
);

builder.mutationField("submitAttendance", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: true }),
      date: t.arg.string({ required: true }),
      records: t.arg({
        type: [AttendanceRecordInput],
        required: true,
      }),
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

      return await submitAttendance(
        cookieObj["access_token"],
        args.courseId,
        args.date,
        args.records,
      );
    },
  }),
);

interface StudentAttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: string;
}

const StudentAttendanceRecordObject = builder
  .objectRef<StudentAttendanceRecord>("StudentAttendanceRecord")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      courseId: t.exposeString("courseId"),
      date: t.exposeString("date"),
      status: t.exposeString("status"),
    }),
  });

const StudentAttendanceResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: StudentAttendanceRecord[];
  }>("StudentAttendanceResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [StudentAttendanceRecordObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("getStudentAttendance", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: StudentAttendanceResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
          data: [],
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
          data: [],
        };
      }

      return await getStudentAttendance(cookieObj["access_token"]);
    },
  }),
);
