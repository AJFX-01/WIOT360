import Fastify from 'fastify';
import prisma from '../prisma';
import vehicleRoutes from './routes/route';

const fastify = Fastify();

fastify.register(vehicleRoutes, { prefix: '/api' });

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});