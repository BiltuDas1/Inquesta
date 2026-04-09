import Fastify from "fastify";
import { createYoga } from "graphql-yoga";
import { type FastifyContext, schema } from "./schemas/schema.ts";

// Checking if it's production
const isProduction = process.env.PRODUCTION !== undefined;
const yoga = createYoga<FastifyContext>({
  schema,
  graphqlEndpoint: "/",
  graphiql: !isProduction,
});

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
  url: "/",
  method: ["GET", "POST", "OPTIONS"],
  handler: async (req, reply) => {
    return yoga.handleNodeRequestAndResponse(req, reply, { req, reply });
  },
});

// Start the Server
const host = isProduction ? "0.0.0.0" : "127.0.0.1";
server.listen({ port: 4000, host: host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(
    (isProduction ? "Production" : "Development") +
      " Server Started Successfully",
  );
});
