import { z } from 'zod';

export const createVehicleTypeSchema = z.object({
  name: z.string().min(2)
});

export const createOperationSchema = z.object({
  vehicleTypeId: z.number().int().positive(),
  quantity: z.number().int().positive()
});

export const createScheduleSchema = z.object({
  vehicleTypeId: z.number().int().positive(),
  source: z.string().min(2),
  destination: z.string().min(2),
  duration: z.number().positive(),
  distance: z.number().positive(),
  timeOfDay: z.string(), // we'll validate format maybe later
  startDate: z.string(), // cast to Date later
  endDate: z.string().optional(), // optional
  repeatPattern: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
});