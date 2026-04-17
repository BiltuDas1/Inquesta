import { type FastifyRequest, type FastifyReply, type FastifyBaseLogger } from "fastify";

export type FastifyContext = {
  req: FastifyRequest;
  reply: FastifyReply;
  logger: FastifyBaseLogger;
};
