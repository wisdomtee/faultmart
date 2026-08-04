import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { orderController } from "./order.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates an order after an offer has been accepted.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - offerId
 *             properties:
 *               offerId:
 *                 type: string
 *                 example: 8f6d8b51-8c9d-4b87-95b3-c1d8a2d6b1f4
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  orderController.createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get my orders
 *     description: Returns all orders belonging to the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticate,
  orderController.getMyOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Returns details of a specific order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  authenticate,
  orderController.getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Updates the current status of an order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
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
 *                 example: CONFIRMED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/status",
  authenticate,
  orderController.updateStatus
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     description: Cancels an existing order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/cancel",
  authenticate,
  orderController.cancelOrder
);

export default router;