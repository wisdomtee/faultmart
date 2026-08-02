import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  username: z.string().min(3).optional(),
  phone: z.string().min(10).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bio: z.string().max(500).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});