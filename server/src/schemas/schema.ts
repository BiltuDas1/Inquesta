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
    type Mutation {
      restartServer(secret: String!): String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello World!",
    },
    Mutation: {
      restartServer: (_parent, args) => {
        // Check if the "STAGING" environment variable exists at all
        // If it doesn't, this feature is completely disabled.
        const isStaging = process.env.STAGING !== undefined;

        if (!isStaging) {
          throw new Error("This action is only available in the Staging environment.");
        }

        // Secondary check: Security Secret
        if (args.secret !== process.env.RESTART_SECRET) {
          throw new Error("Invalid restart secret.");
        }

        // Trigger the reboot
        setTimeout(() => {
          console.log("Staging restart triggered. Powering down...");
          process.exit(0); 
        }, 1000);

        return "Reboot request received";
      },
    },
  },
});
