import { Router } from "express";

import controller from "./notification.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications and alerts
 */

/**
 * All notification routes require authentication
 */
router.use(authenticate);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get my notifications
 *     description: Returns all notifications belonging to the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  controller.getNotifications
);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     description: Returns the number of unread notifications.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/unread-count",
  controller.getUnreadCount
);

/**
 * @swagger
 * /api/notifications/test:
 *   post:
 *     summary: Send a test notification
 *     description: Sends a test notification for development and Socket.IO testing.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test notification sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/test",
  controller.testNotification
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     description: Marks a single notification as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.patch(
  "/:id/read",
  controller.markAsRead
);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     description: Marks every notification belonging to the authenticated user as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch(
  "/read-all",
  controller.markAllAsRead
);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     description: Deletes one notification.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete(
  "/:id",
  controller.deleteNotification
);

export default router;