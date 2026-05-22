import { builder } from "../libraries/builder.ts";

export type HeroSection = {
  statusBadge: string,
  heading: string,
  description: string,
  heroImageUrl: string
};

export const HeroSectionObject = builder
  .objectRef<HeroSection>("HeroSection")
  .implement({
    fields: (t) => ({
      statusBadge: t.exposeString("statusBadge"),
      heading: t.exposeString("heading"),
      description: t.exposeString("description"),
      heroImageUrl: t.exposeString("heroImageUrl"),
    }),
  });
