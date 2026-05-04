import { builder } from "../libraries/builder.ts";
import { getUploadToken } from "../resolvers/file.ts";
import { generateUrlSafeToken } from "../utils/token.ts";

const uploadResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: {
      url: string;
      filename: string;
    };
  }>("UploadResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: builder
          .objectRef<{ url: string; filename: string }>("UploadResponseData")
          .implement({
            fields: (t) => ({
              url: t.exposeString("url"),
              filename: t.exposeString("filename"),
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
      mimetype: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      try {
        const filename = `uploads/${generateUrlSafeToken()}`;
        const url = await getUploadToken(filename, args.mimetype, 5 * 60); // Expire the token in 5 min
        return {
          success: true,
          message: "successfully generated the url",
          data: {
            url: url,
            filename: filename,
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
