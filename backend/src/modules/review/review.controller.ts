import { Request, Response } from "express";

import { reviewService } from "./review.service";

import { asyncHandler } from "../../middleware/asyncHandler";

import { successResponse } from "../../helpers/response";

class ReviewController {

  /**
   * Create Review
   */
  createReview = asyncHandler(
    async (req: Request, res: Response) => {

      const result =
        await reviewService.createReview(
          req.user!.id,
          req.body
        );

      return successResponse(
        res,
        result,
        "Review created successfully.",
        201
      );

    }
  );

  /**
   * Get User Reviews
   */
  getUserReviews = asyncHandler(
    async (req: Request, res: Response) => {

      const result =
        await reviewService.getUserReviews(
          String(req.params.id),
          req.query
        );

      return successResponse(
        res,
        result,
        "Reviews retrieved successfully."
      );

    }
  );

  /**
   * Get Single Review
   */
  getReviewById = asyncHandler(
    async (req: Request, res: Response) => {

      const result =
        await reviewService.getReviewById(
          String(req.params.id)
        );

      return successResponse(
        res,
        result,
        "Review retrieved successfully."
      );

    }
  );

  /**
   * Update Review
   */
  updateReview = asyncHandler(
    async (req: Request, res: Response) => {

      const result =
        await reviewService.updateReview(
          String(req.params.id),
          req.user!.id,
          req.body
        );

      return successResponse(
        res,
        result,
        "Review updated successfully."
      );

    }
  );

  /**
   * Delete Review
   */
  deleteReview = asyncHandler(
    async (req: Request, res: Response) => {

      const result =
        await reviewService.deleteReview(
         String(req.params.id),
          req.user!.id
        );

      return successResponse(
        res,
        result,
        result.message
      );

    }
  );

  /**
   * Rating Summary
   */
  getRatingSummary = asyncHandler(
    async (req: Request, res: Response) => {

      const result =
        await reviewService.getRatingSummary(
          String(req.params.id)
        );

      return successResponse(
        res,
        result,
        "Rating summary retrieved successfully."
      );

    }
  );

}

export default new ReviewController();