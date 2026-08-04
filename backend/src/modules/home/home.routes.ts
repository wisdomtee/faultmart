import { Router } from "express";
import homeController from "./home.controller";

const router = Router();

/**
 * Public homepage endpoint
 */
router.get(
  "/",
  homeController.getHomepage
);

export default router;