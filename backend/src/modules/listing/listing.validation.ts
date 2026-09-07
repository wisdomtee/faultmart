import { z } from "zod";

import {
  Currency,
  FaultSeverity,
  ListingCondition,
} from "@prisma/client";

/**
 * Convert multipart/form-data boolean values.
 */
const booleanFromMultipart = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    throw new Error("Invalid boolean value");
  });

/**
 * Convert multipart/form-data number values.
 */
const numberFromMultipart = z
  .union([z.number(), z.string()])
  .transform((value) => {
    const number =
      typeof value === "number"
        ? value
        : Number(value);

    if (!Number.isFinite(number)) {
      throw new Error("Invalid number value");
    }

    return number;
  });

/**
 * Create Listing
 *
 * Validation middleware passes:
 * {
 *   body,
 *   params,
 *   query
 * }
 *
 * Therefore the request body must be wrapped
 * inside the `body` property.
 */
export const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(150),

    description: z.string().min(20),

    categoryId: z.string().uuid(),

    price: numberFromMultipart.pipe(
      z.number().positive()
    ),

    currency: z
      .nativeEnum(Currency)
      .optional(),

    negotiable:
      booleanFromMultipart.optional(),

    condition:
      z.nativeEnum(ListingCondition),

    faultSeverity:
      z.nativeEnum(FaultSeverity).optional(),

    faultDescription:
      z.string().optional(),

    location:
      z.string().optional(),

    state:
      z.string().min(2).optional(),

    city:
      z.string().min(2).optional(),
  }),
});

/**
 * Update Listing
 *
 * Every field is optional, but when supplied
 * it must still conform to the real Prisma enum.
 */
export const updateListingSchema = z.object({
  body: z.object({
    title:
      z.string().min(5).max(150).optional(),

    description:
      z.string().min(20).optional(),

    categoryId:
      z.string().uuid().optional(),

    price:
      numberFromMultipart
        .pipe(z.number().positive())
        .optional(),

    currency:
      z.nativeEnum(Currency).optional(),

    negotiable:
      booleanFromMultipart.optional(),

    condition:
      z.nativeEnum(ListingCondition).optional(),

    faultSeverity:
      z.nativeEnum(FaultSeverity).optional(),

    faultDescription:
      z.string().optional(),

    location:
      z.string().optional(),

    state:
      z.string().min(2).optional(),

    city:
      z.string().min(2).optional(),
  }),
});
