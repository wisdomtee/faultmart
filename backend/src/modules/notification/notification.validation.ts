import { z } from "zod";
import { NotificationType } from "@prisma/client";

export const createNotificationSchema = z.object({
  userId: z.uuid("Invalid user ID."),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title cannot exceed 150 characters."),

  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(1000, "Message cannot exceed 1000 characters."),

  type: z.nativeEnum(NotificationType),

  referenceId: z.uuid("Invalid reference ID.").optional(),

  referenceType: z
    .string()
    .trim()
    .max(100)
    .optional(),
});

export const markNotificationAsReadSchema = z.object({
  id: z.uuid("Invalid notification ID."),
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  isRead: z.coerce.boolean().optional(),
});