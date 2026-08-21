import { z } from "zod";
import {
  ReportReason,
  ReportStatus,
} from "@prisma/client";

export const createReportSchema = z.object({
  body: z
    .object({
      listingId: z.string().uuid().optional(),

      reportedUserId: z.string().uuid().optional(),

      reason: z.enum([
        "SPAM",
        "FRAUD",
        "FAKE_ITEM",
        "PROHIBITED_ITEM",
        "ABUSE",
        "SCAM",
        "OTHER",
      ]),

      description: z
        .string()
        .max(1000)
        .optional(),
    })
    .refine(
      (data) =>
        Boolean(data.listingId) ||
        Boolean(data.reportedUserId),
      {
        message:
          "Either listingId or reportedUserId is required.",
        path: ["listingId"],
      }
    ),
});

export const updateReportStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ReportStatus),
  }),
});