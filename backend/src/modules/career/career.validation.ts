import { z } from "zod";

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
] as const;

const jobStatuses = ["OPEN", "CLOSED", "DRAFT"] as const;

const applicationStatuses = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
] as const;

export const createJobSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  department: z.string().min(2),
  location: z.string().min(2),
  employmentType: z.enum(employmentTypes),
  description: z.string().min(10),
  responsibilities: z.string().min(10),
  requirements: z.string().min(10),
  salaryRange: z.string().optional(),
  status: z.enum(jobStatuses).optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const applyForJobSchema = z.object({
  cvUrl: z.string().url(),
  coverLetter: z.string().max(10000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(applicationStatuses),
  adminNotes: z.string().max(5000).optional(),
});