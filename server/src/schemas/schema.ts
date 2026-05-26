import { builder } from "../libraries/builder.ts";

import "./health.ts";
import "./auth.ts";
import "./course.ts";
import "./file.ts";
import "./notice.ts";
import "./hero.ts";
import "./filter.ts";

export const schema = builder.toSchema();
