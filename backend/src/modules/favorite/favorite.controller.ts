import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";
import { favoriteService } from "./favorite.service";

class FavoriteController {
  /**
   * POST /api/favorites/:listingId
   */
  addFavorite = asyncHandler(async (req: Request, res: Response) => {
    const favorite = await favoriteService.addFavorite(
      req.user.userId,
      req.params.listingId
    );

    return successResponse(
      res,
      favorite,
      "Listing added to favorites.",
      201
    );
  });

  /**
   * DELETE /api/favorites/:listingId
   */
  removeFavorite = asyncHandler(async (req: Request, res: Response) => {
    const result = await favoriteService.removeFavorite(
      req.user.userId,
      req.params.listingId
    );

    return successResponse(
      res,
      result,
      "Favorite removed successfully."
    );
  });

  /**
   * GET /api/favorites
   */
  getMyFavorites = asyncHandler(async (req: Request, res: Response) => {
    const favorites = await favoriteService.getMyFavorites(
      req.user.userId
    );

    return successResponse(
      res,
      favorites,
      "Favorites retrieved successfully."
    );
  });

  /**
   * GET /api/favorites/count/:listingId
   */
  getFavoriteCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await favoriteService.getFavoriteCount(
      req.params.listingId
    );

    return successResponse(
      res,
      count,
      "Favorite count retrieved successfully."
    );
  });

  /**
   * GET /api/favorites/check/:listingId
   */
  isFavorited = asyncHandler(async (req: Request, res: Response) => {
    const result = await favoriteService.isFavorited(
      req.user.userId,
      req.params.listingId
    );

    return successResponse(
      res,
      result,
      "Favorite status retrieved successfully."
    );
  });
}

export default new FavoriteController();