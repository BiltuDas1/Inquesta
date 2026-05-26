import { builder, GQLResponse } from "../libraries/builder.ts";
import * as cookie from "cookie";
import { addCourseCart } from "../resolvers/cart.ts";

builder.mutationField("addCourseToCart", (t) => 
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: true })
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

      return await addCourseCart(cookieObj["access_token"], args.courseId)
    }
  })
);
