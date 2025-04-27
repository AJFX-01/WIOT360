import  { FastifyRequest, FastifyReply } from 'fastify';
import { createOperationSchema, createScheduleSchema, createVehicleTypeSchema } from '../validators/validators';
import prisma from '../../prisma';

export const createVehicleType = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = createVehicleTypeSchema.parse(request.body);
    const vehicle = await prisma.vehicleType.create({ data });
    reply.code(201).send(vehicle);
  } catch (err) {
    reply.code(400).send({ error: err });
  }
};

export const updateVehicleType = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id, 10);
    const data = createVehicleTypeSchema.parse(request.body);

    const vehicle = await prisma.vehicleType.update({
      where: { id },
      data,
    });

    reply.code(200).send(vehicle);
  } catch (err) {
    reply.code(400).send({ error: (err) });
  }
};


export const createOperation = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = createOperationSchema.parse(request.body);
    const operation = await prisma.operation.create({ data });
    reply.code(201).send(operation);
  } catch (err) {
    reply.code(400).send({ error: err });
  }
};

export const updateOperation = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id, 10);
    const data = createOperationSchema.parse(request.body);

    const operation = await prisma.operation.update({
      where: { id },
      data,
    });

    reply.code(200).send(operation);
  } catch (err) {
    reply.code(400).send({ error: (err) });
  }
};


export const createSchedule = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsed = createScheduleSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors });
    }

    const { vehicleTypeId, source, destination, duration, distance, timeOfDay, startDate, endDate, repeatPattern } = parsed.data;

    const newRepeatingSchedule = await prisma.schedule.create({
      data: {
        vehicleTypeId,
        source,
        destination,
        duration,
        distance,
        timeOfDay,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        repeatPattern,
      },
    });

    return reply.status(201).send(newRepeatingSchedule);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Something went wrong." });
  }

};

export const updateSchedule = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id, 10);
    const data = createScheduleSchema.parse(request.body);

    const schedule = await prisma.schedule.update({
      where: { id },
      data,
    });

    reply.code(200).send(schedule);
  } catch (err) {
    reply.code(400).send({ error: (err) });
  }
};


export const getAllOperations = async (_request: FastifyRequest, reply: FastifyReply) => {
  const operations = await prisma.operation.findMany({
    where: { deletedAt: null },
    include: { vehicleType: true }
  });
  reply.send(operations);
};

export const getSchedulesByVehicleType = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = parseInt((request.params as any).id);
  const schedules = await prisma.schedule.findMany({
    where: { vehicleTypeId: id, deletedAt: null }
  });
  reply.send(schedules);
};

export const softDeleteVehicleType = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = parseInt((request.params as any).id);
  const deletedAt = new Date();

  try {
    await prisma.$transaction([
      prisma.schedule.updateMany({ where: { vehicleTypeId: id }, data: { deletedAt } }),
      prisma.operation.updateMany({ where: { vehicleTypeId: id }, data: { deletedAt } }),
      prisma.vehicleType.update({ where: { id }, data: { deletedAt } })
    ]);

    reply.send({ message: 'VehicleType and related records soft-deleted' });
  } catch (err) {
    reply.code(500).send({ error: err });
  }
};

export const getAggregatedData = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = parseInt((request.params as any).id);
  try {
    const totalOperations = await prisma.operation.aggregate({
      _sum: {
        quantity: true
      },
      where: {
        vehicleTypeId: id,
        deletedAt: null
      }
    });

    const totalSchedules = await prisma.schedule.count({
      where: {
        vehicleTypeId: id,
        deletedAt: null
      }
    });

    reply.send({
      totalOperations: totalOperations._sum.quantity ?? 0,
      totalSchedules
    });
  } catch (err) {
    reply.code(500).send({ error: err });
  }
};

export const getAllVehicleTypes = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      where: { deletedAt: null },
      include: {
        operations: {
          where: { deletedAt: null }
        },
        schedules: {
          where: { deletedAt: null }
        }
      }
    });
    reply.send(vehicleTypes);
  } catch (err) {
    reply.code(500).send({ error: err });
  }
};