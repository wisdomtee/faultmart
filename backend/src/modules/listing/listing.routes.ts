import { Router } from "express";
import listingController from "./listing.controller";
import { authenticate } from "../../middleware/auth.middleware";
import upload from "../../middleware/upload";

const router = Router();

/**
 * Public Routes
 */
router.get("/", listingController.getListings);

/**
 * Protected Routes
 */
router.post(
  "/",
  authenticate,
  upload.array("images", 10),
  listingController.createListing
);

router.get(
  "/me",
  authenticate,
  listingController.myListings
);

router.delete(
  "/:id",
  authenticate,
  listingController.deleteListing
);

/**
 * Public Route (Get Listing by ID)
 */
router.get(
  "/id/:id",
  listingController.getListingById
);

/**
 * Public Route (Get Listing by Slug)
 * Keep this LAST
 */
router.get(
  "/:slug",
  listingController.getListingBySlug
);

export default router;