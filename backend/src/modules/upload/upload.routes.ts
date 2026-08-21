import { Router } from "express";

import upload from "../../middleware/upload";
import { authenticate } from "../../middleware/auth.middleware";
import {
  uploadImages,
  uploadCV,
} from "./upload.controller";

const router = Router();

/**
 * Listing images
 */
router.post(
  "/",
  authenticate,
  upload.array("files", 10),
  uploadImages
);

/**
 * Career CV
 */
router.post(
  "/cv",
  authenticate,
  upload.single("cv"),
  uploadCV
);

export default router;