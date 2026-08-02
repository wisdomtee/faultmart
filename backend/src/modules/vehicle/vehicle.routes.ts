import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";

import {
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} from "./vehicle.controller";

const router = Router();

/**
 * Create vehicle details
 */
router.post(
  "/:listingId",
  authenticate,
  createVehicle
);

/**
 * Get vehicle details
 */
router.get(
  "/:listingId",
  getVehicle
);

/**
 * Update vehicle details
 */
router.patch(
  "/:listingId",
  authenticate,
  updateVehicle
);

/**
 * Delete vehicle details
 */
router.delete(
  "/:listingId",
  authenticate,
  deleteVehicle
);

export default router;