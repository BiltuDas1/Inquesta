import { builder, GQLResponse } from "../libraries/builder.ts";
import { getHeroSection } from "../resolvers/hero.ts";
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
      const result = await getHeroSection()
      if (result !== null) {
        return {
          success: true,
          message: "hero section fetch successfully",
          data: result
        };
      } else {
        return {
          success: false,
          message: "failed to fetch hero section"
        }
      }
    },
  }),
);
