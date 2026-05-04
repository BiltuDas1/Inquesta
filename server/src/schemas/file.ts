import { builder } from "../libraries/builder.ts";
import { getUploadToken } from "../resolvers/file.ts";

const uploadResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: { url: string };
  }>("UploadResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: builder
          .objectRef<{ url: string }>("UploadResponseData")
          .implement({
            fields: (t) => ({
              url: t.exposeString("url"),
            }),
          }),
        nullable: true,
      }),
    }),
  });

builder.mutationField("request_upload", (t) =>
  t.field({
    type: uploadResponse,
    args: {
      filename: t.arg.string({ required: true }),
      mimetype: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      try {
        const url = await getUploadToken(args.filename, args.mimetype, 5 * 60); // Expire the token in 5 min
        return {
          success: true,
          message: "successfully generated the url",
          data: {
            url: url,
          },
        };
      } catch (error) {
        context.logger.error(error);
        return {
          success: false,
          message: "failed to request upload file url",
        };
      }
    },
  }),
);
