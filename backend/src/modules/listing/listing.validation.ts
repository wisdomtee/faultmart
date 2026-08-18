import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(5).max(150),

  description: z.string().min(20),

  categoryId: z.string().uuid(),

  price: z.number().positive(),

  currency: z.string().optional(),

  negotiable: z.boolean().optional(),

  condition: z.literal("FAULTY"),

  faultSeverity: z.string().optional(),

  faultDescription: z.string().optional(),

  location: z.string().optional(),

  state: z.string().min(2),

  city: z.string().min(2),
});

export const updateListingSchema =
  createListingSchema.partial();