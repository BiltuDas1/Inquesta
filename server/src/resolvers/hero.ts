import { inArray, sql } from "drizzle-orm";
import { db, s3PublicEndpoint } from "../config.ts";
import { hero_settings } from "../databases/schema.ts";

export async function getHeroSection() {
  try {
    const result = await db
      .select()
      .from(hero_settings)
      .where(
        inArray(hero_settings.key, [
          "status_badge",
          "heading",
          "description",
          "hero_image",
        ]),
      );

    let data = {
      statusBadge: "REGISTRATION IS CURRENTLY GOING ON",
      heading: "Learn. Build. Innovate.",
      description:
        "Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    };
    for (const item of result) {
      if (item.key === "status_badge" && item.value) {
        data["statusBadge"] = item.value;
      }
      if (item.key === "heading" && item.value) {
        data["heading"] = item.value;
      }
      if (item.key === "description" && item.value) {
        data["description"] = item.value;
      }
      if (item.key === "hero_image" && item.value) {
        data["heroImageUrl"] = `${s3PublicEndpoint}${item.value}`;
      }
    }

    return data;
  } catch (error) {
    return null;
  }
}

export async function updateHeroSection(
  statusBadge: string,
  heading: string,
  description: string,
  heroImage: string,
) {
  try {
    await db.transaction(async (tx) => {
      await tx.execute(
        sql`REPLACE INTO ${hero_settings} VALUES ("status_badge", ${statusBadge})`,
      );
      await tx.execute(
        sql`REPLACE INTO ${hero_settings} VALUES ("heading", ${heading})`,
      );
      await tx.execute(
        sql`REPLACE INTO ${hero_settings} VALUES ("description", ${description})`,
      );
      await tx.execute(
        sql`REPLACE INTO ${hero_settings} VALUES ("hero_image", ${heroImage})`,
      );
    });

    return true;
  } catch (error) {
    return false;
  }
}
