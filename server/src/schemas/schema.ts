import { builder } from "../libraries/builder.ts";

import "./health.ts";
import "./register.ts";

export const schema = builder.toSchema();
