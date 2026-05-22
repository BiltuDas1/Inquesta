import { builder, GQLResponse } from "../libraries/builder.ts";
import { getHeroSection, updateHeroSection } from "../resolvers/hero.ts";
import { HeroSectionObject, type HeroSection } from "../types/hero.ts";

const heroSectionResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
    data?: HeroSection;
  }>("HeroSectionResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: HeroSectionObject,
        nullable: true,
      }),
    }),
  });

builder.queryField("getHeroSection", (t) =>
  t.field({
    type: heroSectionResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      const result = await getHeroSection();
      if (result !== null) {
        return {
          success: true,
          message: "hero section fetch successfully",
          data: result,
        };
      } else {
        return {
          success: false,
          message: "failed to fetch hero section",
        };
      }
    },
  }),
);

builder.mutationField("updateHero", (t) =>
  t.field({
    authScopes: {
      isValidSession: true
    },
    type: GQLResponse,
    args: {
      statusBadge: t.arg.string({ required: true }),
      heading: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      heroImage: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      const result = await updateHeroSection(
        args.statusBadge,
        args.heading,
        args.description,
        args.heroImage,
      );
      if (result) {
        return {
          success: true,
          message: "hero section updated successfully",
        };
      } else {
        return {
          success: false,
          message: "failed to update hero section",
        };
      }
    },
  }),
);
