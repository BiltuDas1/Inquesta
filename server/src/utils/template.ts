import { readFileSync } from "node:fs";
import path from "node:path";

interface MagicLinkConfig {
  verification_link: string;
  target_email: string;
  expiry_minutes: number;
}

type TemplateArgs = { type: "magic-link"; config: MagicLinkConfig };

export class Template {
  private readonly templates: Record<string, string> = {};

  constructor() {
    this.templates["magic-link"] = readFileSync(
      path.join(process.cwd(), "src", "templates", "email", "magic_link.html"),
      "utf-8",
    );
  }

  getTemplate({ type, config }: TemplateArgs): string {
    const rawTemplate = this.templates[type];

    if (!rawTemplate) {
      throw new Error(`Template ${type} not found`);
    }

    return rawTemplate.replace(/{{(.*?)}}/g, (match, key) => {
      const trimmedKey = key.trim();
      const value = (config as any)[trimmedKey];

      // If the value exists, return it; otherwise, return the original {{key}}
      return value !== undefined ? String(value) : match;
    });
  }
}
