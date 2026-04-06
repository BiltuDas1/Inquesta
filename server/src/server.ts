import Fastify from 'fastify';
import { createYoga, createSchema } from 'graphql-yoga';

// 1. Define your Schema & Resolvers (The GraphQL part)
const schema = createSchema({
  typeDefs: `
    type Query {
      hello: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hello from Fastify + GraphQL Yoga!',
    },
  },
});

// 2. Create the Yoga Instance
const yoga = createYoga({ schema });

// 3. Create the Fastify Server
const server = Fastify({ logger: true });

// 4. Connect Yoga to Fastify
server.route({
  url: '/graphql',
  method: ['GET', 'POST', 'OPTIONS'],
  handler: async (req, reply) => {
    // Note: We use handleNodeRequest here, not handleNodeRequestAndResponse
    const response = await yoga.handleNodeRequest(req, { req, reply });
    
    // Copy the headers over
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });

    reply.status(response.status);
    
    // Send the body
    reply.send(response.body);

    // CRITICAL: Fastify requires you to return the reply in async handlers!
    return reply; 
  },
});

// 5. Start the Engine!
server.listen({ port: 4000 }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log('API is live at http://localhost:4000/graphql');
});