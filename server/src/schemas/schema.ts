import { builder } from "../libraries/builder.ts";

import "./health.ts";
import "./auth.ts";

export const schema = builder.toSchema();
