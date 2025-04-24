import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import vehicleRoutes from '../routes/route';


const prisma = new PrismaClient();

describe('Vehicle Routes', () => {
  const fastify = Fastify();
  beforeAll(async () => {
    fastify.register(vehicleRoutes, { prefix: '/api' });
    await fastify.ready();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await fastify.close();
  });

  let vehicleTypeId: number;

  it('should create a vehicle type', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/vehicle-types',
      payload: { name: 'Truck' }
    });
    console.log("test1",response)
    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    vehicleTypeId = body.id;
    expect(body.name).toBe('Truck');
  });

  it('should create an operation for vehicle type', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/operations',
      payload: {
        vehicleTypeId,
        quantity: 5
      }
    });
    console.log("test2",response)
    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.vehicleTypeId).toBe(vehicleTypeId);
  });

  it('should create a schedule for vehicle type', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/schedules',
      payload: {
        vehicleTypeId,
        source: 'City A',
        destination: 'City B',
        duration: 2.5,
        distance: 120.0,
        date: new Date().toISOString()
      }
    });
    console.log("test3",response)
    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.source).toBe('City A');
  });

  it('should fetch all vehicle types', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/vehicle-types'
    });
    console.log("test5",response)
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBeGreaterThan(0);
  });

  it('should fetch aggregates for vehicle type', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/vehicle-types/${vehicleTypeId}/aggregates`
    });
    console.log("test5",response)
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.totalOperations).toBeGreaterThan(0);
    expect(body.totalSchedules).toBeGreaterThan(0);
  });

  it('should soft delete vehicle type and related data', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: `/api/vehicle-types/${vehicleTypeId}`
    });
    console.log("test5",response)
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toBe('VehicleType and related records soft-deleted');
  });

  it('should return no data after soft deletion', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/vehicle-types/${vehicleTypeId}/schedules`
    });
    console.log("test7",response)
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBe(0);
  });
});
