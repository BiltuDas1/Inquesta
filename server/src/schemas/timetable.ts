import { builder, GQLResponse } from "../libraries/builder.ts";
import * as cookie from "cookie";
import {
  addTimetableEntry,
  deleteTimetableEntry,
  getTimetableEntries,
} from "../resolvers/timetable.ts";

export interface TimetableEntry {
  id: string;
  userId: string;
  subject: string;
  day: string;
  startHour: number;
  durationHours: number;
  room?: string | null;
  colorClass?: string | null;
  eventType?: string | null;
}

const TimetableEntryObject = builder
  .objectRef<TimetableEntry>("TimetableEntry")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      userId: t.exposeString("userId"),
      subject: t.exposeString("subject"),
      day: t.exposeString("day"),
      startHour: t.exposeInt("startHour"),
      durationHours: t.exposeInt("durationHours"),
      room: t.exposeString("room", { nullable: true }),
      colorClass: t.exposeString("colorClass", { nullable: true }),
      eventType: t.exposeString("eventType", { nullable: true }),
    }),
  });

const timetableResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: TimetableEntry[];
  }>("TimetableResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [TimetableEntryObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("getTimetable", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: timetableResponse,
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

      return await getTimetableEntries(cookieObj["access_token"]);
    },
  }),
);

builder.mutationField("addTimetableEntry", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      subject: t.arg.string({ required: true }),
      day: t.arg.string({ required: true }),
      startHour: t.arg.int({ required: true }),
      durationHours: t.arg.int({ required: false }),
      room: t.arg.string({ required: false }),
      colorClass: t.arg.string({ required: false }),
      eventType: t.arg.string({ required: false }),
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

      return await addTimetableEntry(cookieObj["access_token"], {
        subject: args.subject,
        day: args.day,
        startHour: args.startHour,
        durationHours: args.durationHours,
        room: args.room,
        colorClass: args.colorClass,
        eventType: args.eventType,
      });
    },
  }),
);

builder.mutationField("deleteTimetableEntry", (t) =>
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

      return await deleteTimetableEntry(cookieObj["access_token"], args.id);
    },
  }),
);
