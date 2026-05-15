import { builder, GQLResponse } from "../libraries/builder.ts";
import { addNotice } from "../resolvers/notice.ts";

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
      duration: t.arg.int({ required: false }),
      difficulty: t.arg.string({ required: false }),
      imagePath: t.arg.string({ required: true }),
    },
    resolve: async (_parent, data, context) => {
      return await addNotice(data);
    },
  }),
);
