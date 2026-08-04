import { z } from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    participantId: z
      .string()
      .uuid("Invalid participant ID"),

    listingId: z
      .string()
      .uuid("Invalid listing ID")
      .optional(),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(5000, "Message is too long"),
  }),
});