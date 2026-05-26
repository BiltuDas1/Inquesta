import { builder, GQLResponse } from "../libraries/builder.ts";
import * as cookie from "cookie";
import {
  addCourseCart,
  getItemsFromCart,
  removeFromCart,
} from "../resolvers/cart.ts";
import { CourseObject, type Course } from "../types/course.ts";

builder.mutationField("addCourseToCart", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: true }),
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

      return await addCourseCart(cookieObj["access_token"], args.courseId);
    },
  }),
);

const cartItemsResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: (Course & { id: string })[];
  }>("CartItemsResponse")
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

builder.queryField("getCartItems", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: cartItemsResponse,
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

      return await getItemsFromCart(cookieObj["access_token"]);
    },
  }),
);

builder.mutationField("removeCourseFromCart", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: true }),
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

      return await removeFromCart(cookieObj["access_token"], args.courseId);
    },
  }),
);
