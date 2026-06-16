import { builder, GQLResponse } from "../libraries/builder.ts";
import {
  getAllNotification,
  notificationSend,
} from "../resolvers/notification.ts";
import * as cookie from "cookie";

builder.mutationField("sendNotification", (t) =>
  t.field({
    type: GQLResponse,
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      role: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      return await notificationSend(args.title, args.description, args.role);
    },
  }),
);

const NotificationObject = builder
  .objectRef<{
    title: string;
    description: string;
  }>("Notification")
  .implement({
    fields: (t) => ({
      title: t.exposeString("title"),
      description: t.exposeString("description"),
    }),
  });

export const notificationResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: { title: string; description: string }[];
  }>("NotificationResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [NotificationObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("getNotifications", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: notificationResponse,
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

      return await getAllNotification(cookieObj["access_token"]);
    },
  }),
);
