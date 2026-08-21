import { z } from "zod";

export const listingAssistantSchema = z.object({
  body: z.object({
    title: z.string().trim().max(200).optional(),

    description: z
      .string()
      .trim()
      .max(5000)
      .optional(),

    category: z
      .string()
      .trim()
      .max(100)
      .optional(),

    condition: z
      .string()
      .trim()
      .max(50)
      .optional(),

    faultSeverity: z
      .string()
      .trim()
      .max(50)
      .optional(),

    faultDescription: z
      .string()
      .trim()
      .max(2000)
      .optional(),
  }),
});
