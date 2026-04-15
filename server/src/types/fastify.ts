import { type FastifyRequest, type FastifyReply } from "fastify";

export type FastifyContext = {
  req: FastifyRequest;
  reply: FastifyReply;
};
