import { builder, GQLResponse } from "../libraries/builder.ts";
import { addCourse, getCourse } from "../resolvers/course.ts";
import {
  CourseObject,
  type Course,
  type CourseLevel,
} from "../types/course.ts";

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

const courseResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: Course[];
  }>("CourseResponse")
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

builder.queryField("courseGet", (t) =>
  t.field({
    type: courseResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      try {
        const result = await getCourse();
        return {
          success: true,
          message: "course list has been fetched successfully",
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message: "unable to fetch courses list",
        };
      }
    },
  }),
);
