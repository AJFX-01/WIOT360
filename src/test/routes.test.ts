import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import vehicleRoutes from '../routes/route';
import prisma from '../../prisma';

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

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.vehicleTypeId).toBe(vehicleTypeId);
  });

  it('should create a repeating schedule for vehicle type', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/schedules',
      payload: {
        vehicleTypeId,
        source: 'City A',
        destination: 'City B',
        duration: 2,
        distance: 120.0,      
        timeOfDay: '10:00',  
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        repeatPattern: 'DAILY'
      }
    });
  
    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.source).toBe('City A');
    expect(body.destination).toBe('City B');
    expect(body.repeatPattern).toBe('DAILY');
  });

  it('should fetch all vehicle types', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/vehicle-types'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBeGreaterThan(0);
  });

  it('should fetch aggregates for vehicle type', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/vehicle-types/${vehicleTypeId}/aggregates`
    });

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

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toBe('VehicleType and related records soft-deleted');
  });

  it('should return no data after soft deletion', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/vehicle-types/${vehicleTypeId}/schedules`
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBe(0);
  });
});
