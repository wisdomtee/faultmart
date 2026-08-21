import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { Role } from "@prisma/client";
import { validate } from "../../middleware/validate";

import careerController from "./career.controller";

import {
  createJobSchema,
  updateJobSchema,
  applyForJobSchema,
  updateApplicationStatusSchema,
} from "./career.validation";

const router = Router();

/**
 * ============================================================
 * PUBLIC CAREERS
 * ============================================================
 */

router.get(
  "/jobs",
  careerController.getJobs
);

router.get(
  "/jobs/:slug",
  careerController.getJobBySlug
);

/**
 * ============================================================
 * AUTHENTICATED APPLICANT
 * ============================================================
 */

router.post(
  "/jobs/:id/apply",
  authenticate,
  validate(applyForJobSchema),
  careerController.applyForJob
);

/**
 * ============================================================
 * ADMIN CAREERS
 * ============================================================
 */

router.post(
  "/admin/jobs",
  authenticate,
  requireRole(Role.ADMIN),
  validate(createJobSchema),
  careerController.createJob
);

router.get(
  "/admin/jobs",
  authenticate,
  requireRole(Role.ADMIN),
  careerController.getAllJobs
);

router.patch(
  "/admin/jobs/:id",
  authenticate,
  requireRole(Role.ADMIN),
  validate(updateJobSchema),
  careerController.updateJob
);

router.delete(
  "/admin/jobs/:id",
  authenticate,
  requireRole(Role.ADMIN),
  careerController.deleteJob
);

router.get(
  "/admin/applications",
  authenticate,
  requireRole(Role.ADMIN),
  careerController.getApplications
);

router.get(
  "/admin/applications/:id",
  authenticate,
  requireRole(Role.ADMIN),
  careerController.getApplicationById
);

router.patch(
  "/admin/applications/:id/status",
  authenticate,
  requireRole(Role.ADMIN),
  validate(updateApplicationStatusSchema),
  careerController.updateApplicationStatus
);

export default router;