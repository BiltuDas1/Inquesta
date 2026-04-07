import { createSchema } from "graphql-yoga";
import { type FastifyRequest, type FastifyReply } from "fastify";

export type FastifyContext = {
  req: FastifyRequest;
  reply: FastifyReply;
};

export const schema = createSchema<FastifyContext>({
  typeDefs: `
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello from Fastify + Yoga!",
    },
  },
});
