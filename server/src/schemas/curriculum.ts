import { builder, GQLResponse } from "../libraries/builder.ts";
import {
  getCurriculumUnits,
  addCurriculumUnit,
  updateCurriculumUnit,
  toggleCurriculumUnitComplete,
  deleteCurriculumUnit,
  getCourseTakeaways,
  addCourseTakeaway,
  deleteCourseTakeaway,
} from "../resolvers/curriculum.ts";

const CurriculumUnitObject = builder
  .objectRef<{
    id: string;
    courseId: string;
    title: string;
    description: string | null;
    completed: boolean;
  }>("CurriculumUnit")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      courseId: t.exposeString("courseId"),
      title: t.exposeString("title"),
      description: t.exposeString("description", { nullable: true }),
      completed: t.exposeBoolean("completed"),
    }),
  });

const CourseTakeawayObject = builder
  .objectRef<{
    id: string;
    courseId: string;
    takeaway: string;
  }>("CourseTakeaway")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      courseId: t.exposeString("courseId"),
      takeaway: t.exposeString("takeaway"),
    }),
  });

const CurriculumUnitsResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: any[];
  }>("CurriculumUnitsResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [CurriculumUnitObject],
        nullable: true,
      }),
    }),
  });

const CourseTakeawaysResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: any[];
  }>("CourseTakeawaysResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [CourseTakeawayObject],
        nullable: true,
      }),
    }),
  });

// Queries
builder.queryField("getCurriculumUnits", (t) =>
  t.field({
    type: CurriculumUnitsResponse,
    args: {
      courseId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args) => {
      try {
        const data = await getCurriculumUnits(args.courseId);
        return {
          success: true,
          message: "Curriculum units fetched successfully",
          data,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to fetch curriculum units",
        };
      }
    },
  }),
);

builder.queryField("getCourseTakeaways", (t) =>
  t.field({
    type: CourseTakeawaysResponse,
    args: {
      courseId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args) => {
      try {
        const data = await getCourseTakeaways(args.courseId);
        return {
          success: true,
          message: "Course takeaways fetched successfully",
          data,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to fetch course takeaways",
        };
      }
    },
  }),
);

// Mutations
builder.mutationField("addCurriculumUnit", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args) => {
      try {
        await addCurriculumUnit(args.courseId, args.title, args.description || undefined);
        return {
          success: true,
          message: "Curriculum unit added successfully",
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to add curriculum unit",
        };
      }
    },
  }),
);

builder.mutationField("updateCurriculumUnit", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args) => {
      try {
        await updateCurriculumUnit(args.id, args.title, args.description || undefined);
        return {
          success: true,
          message: "Curriculum unit updated successfully",
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to update curriculum unit",
        };
      }
    },
  }),
);

builder.mutationField("toggleCurriculumUnitComplete", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args) => {
      try {
        await toggleCurriculumUnitComplete(args.id);
        return {
          success: true,
          message: "Curriculum unit completion toggled successfully",
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to toggle completion status",
        };
      }
    },
  }),
);

builder.mutationField("deleteCurriculumUnit", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args) => {
      try {
        await deleteCurriculumUnit(args.id);
        return {
          success: true,
          message: "Curriculum unit deleted successfully",
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to delete curriculum unit",
        };
      }
    },
  }),
);

builder.mutationField("addCourseTakeaway", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      courseId: t.arg.string({ required: true }),
      takeaway: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args) => {
      try {
        await addCourseTakeaway(args.courseId, args.takeaway);
        return {
          success: true,
          message: "Course takeaway added successfully",
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to add course takeaway",
        };
      }
    },
  }),
);

builder.mutationField("deleteCourseTakeaway", (t) =>
  t.field({
    authScopes: {
      isValidSession: true,
    },
    type: GQLResponse,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args) => {
      try {
        await deleteCourseTakeaway(args.id);
        return {
          success: true,
          message: "Course takeaway deleted successfully",
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to delete course takeaway",
        };
      }
    },
  }),
);
