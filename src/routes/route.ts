import { FastifyInstance } from 'fastify';
import * as controller from '../controllers/controller';

export default async function vehicleRoutes(fastify: FastifyInstance) {
  fastify.post('/vehicle-types', controller.createVehicleType);
  fastify.post('/operations', controller.createOperation);
  fastify.post('/schedules', controller.createSchedule);
  fastify.get('/operations', controller.getAllOperations);
  fastify.get('/vehicle-types/:id/schedules', controller.getSchedulesByVehicleType);
  fastify.get('/vehicle-types/:id/aggregates', controller.getAggregatedData);
  fastify.delete('/vehicle-types/:id', controller.softDeleteVehicleType);
  fastify.get('/vehicle-types', controller.getAllVehicleTypes);
}