import { Router } from "express";
import favoriteController from "./favorite.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

/**
 * All Favorite routes require authentication
 */
router.use(authenticate);

/**
 * GET /api/favorites
 */
router.get(
  "/",
  favoriteController.getMyFavorites
);

/**
 * GET /api/favorites/count/:listingId
 */
router.get(
  "/count/:listingId",
  favoriteController.getFavoriteCount
);

/**
 * GET /api/favorites/check/:listingId
 */
router.get(
  "/check/:listingId",
  favoriteController.isFavorited
);

/**
 * POST /api/favorites/:listingId
 */
router.post(
  "/:listingId",
  favoriteController.addFavorite
);

/**
 * DELETE /api/favorites/:listingId
 */
router.delete(
  "/:listingId",
  favoriteController.removeFavorite
);

export default router;