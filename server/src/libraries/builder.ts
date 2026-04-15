import SchemaBuilder from "@pothos/core";
import { type FastifyContext } from "../types/fastify.ts";

export const builder = new SchemaBuilder<{
  Context: FastifyContext;
}>({});

export const GQLResponse = builder
  .objectRef<{
    success: boolean;
    message: string;
  }>("MutationResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
    }),
  });

// Initialize empty Query/Mutation types so they can be extended elsewhere
builder.queryType({});
builder.mutationType({});
