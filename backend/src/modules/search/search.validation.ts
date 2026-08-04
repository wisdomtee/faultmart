import { z } from "zod";

export const searchSchema = z.object({

  query: z.object({

    q: z.string().optional(),

    categoryId: z.string().optional(),

    state: z.string().optional(),

    condition: z.string().optional(),

    faultSeverity: z.string().optional(),

    minPrice: z.coerce.number().optional(),

    maxPrice: z.coerce.number().optional(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(20),

    sort: z.enum([
      "newest",
      "oldest",
      "priceAsc",
      "priceDesc"
    ]).optional()

  })

});