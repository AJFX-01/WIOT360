import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import vehicleRoutes from './routes/route';

const fastify = Fastify();
const prisma = new PrismaClient();

fastify.register(vehicleRoutes, { prefix: '/api' });

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});