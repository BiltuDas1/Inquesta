import Fastify from "fastify";
import cors from "@fastify/cors";
import { createYoga } from "graphql-yoga";
import { schema } from "./schemas/schema.ts";
import { allowedOrigins, isProduction, loadEdDSAKey, redis, serverConfig } from "./config.ts";
import type { FastifyContext } from "./types/fastify.ts";

// Create the Fastify server and turn on the pretty logger
const server = Fastify({
  logger: isProduction 
    ? { 
        base: null,
        timestamp: () => {
          const now = new Date();
          const date = now.toISOString().split('T')[0];
          const time = now.toTimeString().split(' ')[0];
          return `,"time":"${date} ${time}"`;
        },
      } : {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
      },
  },
});

const yoga = createYoga<FastifyContext>({
  schema,
  graphqlEndpoint: serverConfig.endpoint,
  graphiql: !isProduction,
  context: () => {
    return {
      logger: server.log,
    };
  },
});

server.register(cors, {
  origin: isProduction ? allowedOrigins : true,
  credentials: true,
});

// Allow GraphiQL to send multipart requests
server.addContentTypeParser("multipart/form-data", {}, (req, payload, done) => {
  done(null);
});

// Connect Yoga to Fastify
server.route({
  url: serverConfig.endpoint,
  method: ["GET", "POST", "OPTIONS"],
  handler: async (req, reply) => {
    return yoga.handleNodeRequestAndResponse(req, reply, { req, reply });
  },
});

server.addHook("onReady", async () => {
  await loadEdDSAKey();
  await redis.connect();
  server.log.info("Redis Connection Ready");
});

// Start the Server
server.listen({ port: serverConfig.port, host: serverConfig.host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(
    (isProduction ? "Production" : "Development") +
      " Server Started Successfully",
  );
});
