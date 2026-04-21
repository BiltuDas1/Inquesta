import SchemaBuilder from "@pothos/core";
import { type FastifyContext } from "../types/fastify.ts";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import type { Auth } from "../types/auth.ts";
import { verify_user } from "../middlewares/verify.ts";

export const builder = new SchemaBuilder<{
  Context: FastifyContext;
  AuthScopes: Auth;
}>({
  plugins: [ScopeAuthPlugin],
  scopeAuth: {
    authorizeOnSubscribe: true,
    authScopes: verify_user,
  },
});

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
