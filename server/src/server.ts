import Fastify from "fastify";
import { createYoga } from "graphql-yoga";
import { type FastifyContext, schema } from "./schemas/schema.ts";

const yoga = createYoga<FastifyContext>({ schema });

// Create the Fastify server and turn on the pretty logger
const server = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

// Allow GraphiQL to send multipart requests
server.addContentTypeParser("multipart/form-data", {}, (req, payload, done) => {
  done(null);
});

// Connect Yoga to Fastify
server.route({
  url: "/graphql",
  method: ["GET", "POST", "OPTIONS"],
  handler: async (req, reply) => {
    return yoga.handleNodeRequestAndResponse(req, reply, { req, reply });
  },
});

// Start the Server
server.listen({ port: 4000 }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info("Server is live at http://localhost:4000/graphql");
});
