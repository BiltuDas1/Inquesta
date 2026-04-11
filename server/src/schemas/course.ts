import { builder } from "../libraries/builder.ts";
import { addCourse } from "../resolvers/course.ts";
import { type CourseLevel } from "../types/course.ts";

builder.mutationField("courseAdd", (t) =>
  t.string({
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      price: t.arg.int({ required: true }),
      level: t.arg.string({ required: true })
    },
    resolve: async (_parent, args, context) => {
      await addCourse({...args, level: args.level as CourseLevel});
      return "course added successfully";
    },
  }),
);
