import { builder, GQLResponse } from "../libraries/builder.ts";
import {
  getResources,
  addResource,
  updateResource,
  deleteResource,
} from "../resolvers/resource.ts";
import { ResourceObject } from "../types/resource.ts";

const resourcesResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: any[];
  }>("ResourcesResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [ResourceObject],
        nullable: true,
      }),
    }),
  });

builder.queryField("getResources", (t) =>
  t.field({
    type: resourcesResponse,
    args: {
      courseId: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, _context) => {
      try {
        const data = await getResources(args.courseId);
        return {
          success: true,
          message: "Resources retrieved successfully",
          data,
        };
      } catch (error: any) {
        console.error("getResources error:", error);
        return {
          success: false,
          message: error.message || "Failed to fetch resources",
        };
      }
    },
  })
);

builder.mutationField("addResource", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: false }),
      title: t.arg.string({ required: true }),
      type: t.arg.string({ required: true }),
      url: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, _context) => {
      try {
        await addResource({
          courseId: args.courseId ?? null,
          title: args.title,
          type: args.type,
          url: args.url,
          description: args.description ?? null,
        });
        return {
          success: true,
          message: "Resource added successfully",
        };
      } catch (error: any) {
        console.error("addResource error:", error);
        return {
          success: false,
          message: error.message || "Failed to add resource",
        };
      }
    },
  })
);

builder.mutationField("updateResource", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
      courseId: t.arg.string({ required: false }),
      title: t.arg.string({ required: true }),
      type: t.arg.string({ required: true }),
      url: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, _context) => {
      try {
        await updateResource(args.id, {
          courseId: args.courseId ?? null,
          title: args.title,
          type: args.type,
          url: args.url,
          description: args.description ?? null,
        });
        return {
          success: true,
          message: "Resource updated successfully",
        };
      } catch (error: any) {
        console.error("updateResource error:", error);
        return {
          success: false,
          message: error.message || "Failed to update resource",
        };
      }
    },
  })
);

builder.mutationField("deleteResource", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, _context) => {
      try {
        await deleteResource(args.id);
        return {
          success: true,
          message: "Resource deleted successfully",
        };
      } catch (error: any) {
        console.error("deleteResource error:", error);
        return {
          success: false,
          message: error.message || "Failed to delete resource",
        };
      }
    },
  })
);
