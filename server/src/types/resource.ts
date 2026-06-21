import { builder } from "../libraries/builder.ts";

export type Resource = {
  id: string;
  courseId?: string | null;
  title: string;
  type: string;
  url: string;
  description?: string | null;
  createdAt: Date;
};

export const ResourceObject = builder
  .objectRef<Resource>("Resource")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      courseId: t.exposeString("courseId", { nullable: true }),
      title: t.exposeString("title"),
      type: t.exposeString("type"),
      url: t.exposeString("url"),
      description: t.exposeString("description", { nullable: true }),
    }),
  });
