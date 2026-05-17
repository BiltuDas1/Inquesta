import { builder } from "../libraries/builder.ts";

export type Notice = {
  title: string;
  description: string;
  badge?: string | null | undefined;
  imagePath: string;
  isActive: boolean;
};

export const NoticeObject = builder
  .objectRef<Notice & { id: string }>("Notice")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      title: t.exposeString("title"),
      imagePath: t.exposeString("imagePath"),
      description: t.exposeString("description"),
      badge: t.exposeString("badge", { nullable: true }),
      isActive: t.exposeBoolean("isActive")
    }),
  });
