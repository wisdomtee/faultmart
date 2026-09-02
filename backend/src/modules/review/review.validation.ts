import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    orderId: z.string().uuid("Invalid order ID"),

    rating: z
      .number()
      .int("Rating must be a whole number")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must not exceed 5"),

    comment: z
      .string()
      .max(1000, "Comment must not exceed 1000 characters")
      .optional()
      .or(z.literal("")),

    type: z.enum([
      "BUYER_TO_SELLER",
      "SELLER_TO_BUYER",
    ]),
  }),
});
export const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int("Rating must be a whole number")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must not exceed 5")
      .optional(),

    comment: z
      .string()
      .max(1000, "Comment must not exceed 1000 characters")
      .optional()
      .or(z.literal("")),
  }),
});