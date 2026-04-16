import { type FastifyRequest, type FastifyReply } from "fastify";
import type { logger } from "../libraries/logger.ts";

export type FastifyContext = {
  req: FastifyRequest;
  reply: FastifyReply;
  logger: typeof logger
};
