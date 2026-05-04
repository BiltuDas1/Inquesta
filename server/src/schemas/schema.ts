import { builder } from "../libraries/builder.ts";

import "./health.ts";
import "./auth.ts";
import "./course.ts";
import "./file.ts";

export const schema = builder.toSchema();
