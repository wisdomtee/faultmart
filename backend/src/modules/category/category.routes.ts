import { Router } from "express";
import categoryController from "./category.controller";

const router = Router();

// GET /api/categories
router.get("/", categoryController.getCategories);

// GET /api/categories/:slug/listings
router.get(
  "/:slug/listings",
  categoryController.getCategoryListings
);

// GET /api/categories/:slug
router.get("/:slug", categoryController.getCategory);

export default router;