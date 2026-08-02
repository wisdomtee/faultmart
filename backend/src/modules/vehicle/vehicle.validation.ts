import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string().min(2).max(100),

  model: z.string().min(1).max(100),

  year: z.number().int().optional(),

  mileage: z.number().int().optional(),

  fuelType: z.string().optional(),

  transmission: z.string().optional(),

  bodyType: z.string().optional(),

  driveType: z.string().optional(),

  engineSize: z.string().optional(),

  color: z.string().optional(),

  registrationYear: z.number().int().optional(),

  registered: z.boolean().optional(),

  accidentHistory: z.boolean().optional(),

  owners: z.number().int().optional(),

  doors: z.number().int().optional(),

  seats: z.number().int().optional(),

  vin: z.string().optional(),

  plateNumber: z.string().optional(),
});

export const updateVehicleSchema =
  createVehicleSchema.partial();