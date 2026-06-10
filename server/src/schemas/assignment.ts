import { builder, GQLResponse } from "../libraries/builder.ts";
import {
  getTeacherAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} from "../resolvers/assignment.ts";
import { GetTeacherAssignmentsResponseObject } from "../types/assignment.ts";
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
