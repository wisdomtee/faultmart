import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { paymentController } from "./payment.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and verification
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a payment
 *     description: Initiates a payment for an order.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 3b77a95f-f2f4-4dd8-8e89-1d70f16d9d27
 *     responses:
 *       201:
 *         description: Payment initialized successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  paymentController.createPayment
);

/**
 * @swagger
 * /api/payments/{orderId}:
 *   get:
 *     summary: Get payment by order
 *     description: Returns payment information for a specific order.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       404:
 *         description: Payment not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:orderId",
  authenticate,
  paymentController.getPayment
);

/**
 * @swagger
 * /api/payments/verify/{reference}:
 *   patch:
 *     summary: Verify payment
 *     description: Verifies a payment using its payment reference.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         description: Payment reference
 *         schema:
 *           type: string
 *           example: FLTM-20260804-001
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Verification failed
 *       404:
 *         description: Payment not found
 */
router.patch(
  "/verify/:reference",
  authenticate,
  paymentController.verifyPayment
);

export default router;