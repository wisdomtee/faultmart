import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { Role } from "@prisma/client";
import adminController from "./admin.controller";
import { validate } from "../../middleware/validate";

import {
  updateUserStatusSchema,
  updateListingStatusSchema,
  updateReportStatusSchema,
} from "./admin.validation";

const router = Router();


/**
 * All admin routes require authentication
 */
router.use(
  authenticate,
  requireRole(Role.ADMIN)
);

/**
 * Dashboard statistics
 */
router.get(
  "/dashboard",
  adminController.getDashboard
);


/**
 * Users
 */
router.get(
  "/users",
  adminController.getUsers
);


router.patch(
  "/users/:id/status",
  validate(updateUserStatusSchema),
  adminController.updateUserStatus
);

/**
 * Listings
 */
router.get(
 "/listings",
 adminController.getPendingListings
);


router.patch(
  "/listings/:id/approve",
  validate(updateListingStatusSchema),
  adminController.approveListing
);


router.patch(
  "/listings/:id/reject",
  validate(updateListingStatusSchema),
  adminController.rejectListing
);


/**
 * Reports
 */
router.get(
  "/reports",
  adminController.getReports
);


router.patch(
  "/reports/:id/status",
  validate(updateReportStatusSchema),
  adminController.updateReportStatus
);


export default router;