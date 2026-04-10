import SchemaBuilder from "@pothos/core";
import { type FastifyContext } from "../types/fastify.ts";

export const builder = new SchemaBuilder<{
  Context: FastifyContext;
}>({});

// Initialize empty Query/Mutation types so they can be extended elsewhere
builder.queryType({});
builder.mutationType({});
