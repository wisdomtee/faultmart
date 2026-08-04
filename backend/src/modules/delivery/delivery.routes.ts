import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { deliveryController } from "./delivery.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Delivery and shipment management
 */

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Create a delivery
 *     description: Creates a delivery record for an existing order.
 *     tags: [Deliveries]
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
 *               courier:
 *                 type: string
 *                 example: DHL
 *               trackingNumber:
 *                 type: string
 *                 example: DHL123456789NG
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  deliveryController.createDelivery
);

/**
 * @swagger
 * /api/deliveries/{orderId}:
 *   get:
 *     summary: Get delivery by order
 *     description: Retrieves the delivery information for a specific order.
 *     tags: [Deliveries]
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
 *         description: Delivery retrieved successfully
 *       404:
 *         description: Delivery not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:orderId",
  authenticate,
  deliveryController.getDelivery
);

/**
 * @swagger
 * /api/deliveries/{id}/status:
 *   patch:
 *     summary: Update delivery status
 *     description: Updates the current delivery status.
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Delivery ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: IN_TRANSIT
 *     responses:
 *       200:
 *         description: Delivery status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Delivery not found
 */
router.patch(
  "/:id/status",
  authenticate,
  deliveryController.updateStatus
);

export default router;