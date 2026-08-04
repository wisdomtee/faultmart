import { Router } from "express";

import reviewController from "./review.controller";

import { authenticate } from "../../middleware/auth.middleware";

import { validate } from "../../middleware/validate";

import {
  createReviewSchema,
  updateReviewSchema,
} from "./review.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: User ratings and reviews
 */

/**
 * @swagger
 * /api/reviews/user/{userId}:
 *   get:
 *     summary: Get reviews for a user
 *     description: Returns all reviews received by a specific user.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       404:
 *         description: User not found
 */
router.get(
  "/user/:userId",
  reviewController.getUserReviews
);

/**
 * @swagger
 * /api/reviews/summary/{userId}:
 *   get:
 *     summary: Get user rating summary
 *     description: Returns the average rating and review statistics for a user.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating summary retrieved successfully
 */
router.get(
  "/summary/:userId",
  reviewController.getRatingSummary
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     description: Returns a single review.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 */
router.get(
  "/:id",
  reviewController.getReviewById
);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review
 *     description: Create a review for another user after a completed transaction.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewedUserId
 *               - orderId
 *               - rating
 *             properties:
 *               reviewedUserId:
 *                 type: string
 *               orderId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent seller. Fast delivery.
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createReviewSchema),
  reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     description: Update your own review.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
router.patch(
  "/:id",
  authenticate,
  validate(updateReviewSchema),
  reviewController.updateReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete your own review.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete(
  "/:id",
  authenticate,
  reviewController.deleteReview
);

export default router;