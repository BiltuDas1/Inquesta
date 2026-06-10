import { builder, GQLResponse } from "../libraries/builder.ts";
import {
  getTeacherAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  updateStudentSubmission,
  getStudentAssignments,
  updateStudentAssignmentStatus,
} from "../resolvers/assignment.ts";
import {
  GetTeacherAssignmentsResponseObject,
  GetAssignmentSubmissionsResponseObject,
  GetStudentAssignmentsResponseObject,
} from "../types/assignment.ts";
import * as cookie from "cookie";

builder.queryField("getTeacherAssignments", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GetTeacherAssignmentsResponseObject,
    resolve: async (_parent, _args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
          data: null,
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
          data: null,
        };
      }

      return await getTeacherAssignments(cookieObj["access_token"]);
    },
  }),
);

builder.mutationField("addAssignment", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      dueDate: t.arg.string({ required: false }),
      isPublished: t.arg.boolean({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return { success: false, message: "no cookie has been passed to the server" };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return { success: false, message: "no access_token cookie" };
      }

      return await addAssignment(cookieObj["access_token"], {
        courseId: args.courseId,
        title: args.title,
        description: args.description,
        dueDate: args.dueDate,
        isPublished: args.isPublished ?? undefined,
      });
    },
  }),
);

builder.mutationField("updateAssignment", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
      dueDate: t.arg.string({ required: false }),
      isPublished: t.arg.boolean({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return { success: false, message: "no cookie has been passed to the server" };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return { success: false, message: "no access_token cookie" };
      }

      return await updateAssignment(cookieObj["access_token"], args.id, {
        title: args.title ?? undefined,
        description: args.description ?? undefined,
        dueDate: args.dueDate,
        isPublished: args.isPublished ?? undefined,
      });
    },
  }),
);

builder.mutationField("deleteAssignment", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return { success: false, message: "no cookie has been passed to the server" };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return { success: false, message: "no access_token cookie" };
      }

      return await deleteAssignment(cookieObj["access_token"], args.id);
    },
  }),
);

builder.queryField("getAssignmentSubmissions", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GetAssignmentSubmissionsResponseObject,
    args: {
      assignmentId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
          data: null,
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
          data: null,
        };
      }

      return await getAssignmentSubmissions(cookieObj["access_token"], args.assignmentId);
    },
  }),
);

builder.mutationField("updateStudentSubmission", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      assignmentId: t.arg.string({ required: true }),
      studentId: t.arg.string({ required: true }),
      status: t.arg.string({ required: false }),
      score: t.arg.int({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return { success: false, message: "no cookie has been passed to the server" };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return { success: false, message: "no access_token cookie" };
      }

      return await updateStudentSubmission(cookieObj["access_token"], args.assignmentId, args.studentId, {
        status: args.status ?? undefined,
        score: args.score ?? undefined,
      });
    },
  }),
);

builder.queryField("getStudentAssignments", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GetStudentAssignmentsResponseObject,
    args: {},
    resolve: async (_parent, _args, context) => {
      if (context.req.headers.cookie === undefined) {
        return {
          success: false,
          message: "no cookie has been passed to the server",
          data: null,
        };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return {
          success: false,
          message: "no access_token cookie",
          data: null,
        };
      }

      return await getStudentAssignments(cookieObj["access_token"]);
    },
  }),
);

builder.mutationField("updateStudentAssignmentStatus", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      assignmentId: t.arg.string({ required: true }),
      status: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (context.req.headers.cookie === undefined) {
        return { success: false, message: "no cookie has been passed to the server" };
      }

      const cookieObj = cookie.parseCookie(context.req.headers.cookie);
      if (cookieObj["access_token"] === undefined) {
        return { success: false, message: "no access_token cookie" };
      }

      return await updateStudentAssignmentStatus(cookieObj["access_token"], args.assignmentId, args.status);
    },
  }),
);
