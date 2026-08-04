import { Router } from "express";
import offerController from "./offer.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Offer management between buyers and sellers
 */

/**
 * All Offer routes require authentication
 */
router.use(authenticate);

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create an offer for a listing
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listingId
 *               - amount
 *             properties:
 *               listingId:
 *                 type: string
 *                 example: c6507aa6-8da1-478f-afc9-7d585d25e537
 *               amount:
 *                 type: number
 *                 example: 250000
 *               message:
 *                 type: string
 *                 example: I can pay immediately.
 *     responses:
 *       201:
 *         description: Offer created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/", offerController.createOffer);

/**
 * @swagger
 * /api/offers/my:
 *   get:
 *     summary: Get all offers made by the current user
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers retrieved successfully
 */
router.get("/my", offerController.getMyOffers);

/**
 * @swagger
 * /api/offers/received:
 *   get:
 *     summary: Get all offers received on your listings
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Received offers retrieved successfully
 */
router.get("/received", offerController.getReceivedOffers);

/**
 * @swagger
 * /api/offers/{id}/accept:
 *   patch:
 *     summary: Accept an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer accepted successfully
 *       404:
 *         description: Offer not found
 */
router.patch(
  "/:id/accept",
  offerController.acceptOffer
);

/**
 * @swagger
 * /api/offers/{id}/reject:
 *   patch:
 *     summary: Reject an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer rejected successfully
 *       404:
 *         description: Offer not found
 */
router.patch(
  "/:id/reject",
  offerController.rejectOffer
);

/**
 * @swagger
 * /api/offers/{id}/withdraw:
 *   patch:
 *     summary: Withdraw an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer withdrawn successfully
 *       404:
 *         description: Offer not found
 */
router.patch(
  "/:id/withdraw",
  offerController.withdrawOffer
);

export default router;