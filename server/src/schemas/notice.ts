import { builder, GQLResponse } from "../libraries/builder.ts";
import {
  addNotice,
  deleteNotice,
  getNotices,
  updateNotice,
} from "../resolvers/notice.ts";
import { NoticeObject, type Notice } from "../types/notice.ts";

builder.mutationField("addNotice", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      badge: t.arg.string({ required: false }),
      image: t.arg.string({ required: true }),
      isActive: t.arg.boolean({ required: true }),
    },
    resolve: async (_parent, data, context) => {
      return await addNotice({
        ...data,
        imagePath: data.image,
      });
    },
  }),
);

builder.mutationField("deleteNotice", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, data, context) => {
      return await deleteNotice(data.id);
    },
  }),
);

builder.mutationField("updateNotice", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      badge: t.arg.string({ required: false }),
      image: t.arg.string({ required: true }),
      isActive: t.arg.boolean({ required: true }),
    },
    resolve: async (_parent, data, context) => {
      return await updateNotice(data.id, {
        ...data,
        imagePath: data.image,
      });
    },
  }),
);

const noticesResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: (Notice & { id: string })[];
  }>("NoticesResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [NoticeObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("getNotices", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: noticesResponse,
    args: {},
    resolve: async (_parent, {}, context) => {
      try {
        const result = await getNotices();
        return {
          success: true,
          message: "notices fetched successfully",
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message: "failed to fetch notices",
        };
      }
    },
  }),
);
