import { z } from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    listingId: z
      .string()
      .uuid("Invalid listing ID"),

    sellerId: z
      .string()
      .uuid("Invalid seller ID"),
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