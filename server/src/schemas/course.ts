import { builder, GQLResponse } from "../libraries/builder.ts";
import { addCourse } from "../resolvers/course.ts";
import { type CourseLevel } from "../types/course.ts";

builder.mutationField("courseAdd", (t) =>
  t.field({
    type: GQLResponse,
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      price: t.arg.int({ required: true }),
      level: t.arg.string({ required: true }),
      duration: t.arg.string({ required: true }),
      instructor_name: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      try {
        await addCourse({
          ...args,
          level: args.level as CourseLevel,
          instructorName: args.instructor_name,
        });
        return {
          success: true,
          message: "course added successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "failed to add course",
        };
      }
    },
  }),
);
