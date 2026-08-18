import { Router } from "express";
import { messageController } from "./message.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { sendMessageSchema } from "../conversation/conversation.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging between buyers and sellers
 */

/**
 * @swagger
 * /api/messages/{conversationId}:
 *   post:
 *     summary: Send a message
 *     description: Send a message to an existing conversation.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Is this item still available?
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.post(
  "/:conversationId",
  authenticate,
  validate(sendMessageSchema),
  messageController.sendMessage
);

/**
 * @swagger
 * /api/messages/{conversationId}:
 *   get:
 *     summary: Get conversation messages
 *     description: Returns all messages in a conversation.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.get(
  "/:conversationId",
  authenticate,
  messageController.getMessages
);

/**
 * @swagger
 * /api/messages/{messageId}/read:
 *   patch:
 *     summary: Mark a message as read
 *     description: Marks a message as read by the authenticated user.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
router.patch(
  "/:messageId/read",
  authenticate,
  messageController.markAsRead
);

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Delete your own message
 *     description: Deletes a message created by the authenticated user.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
router.delete(
  "/:messageId",
  authenticate,
  messageController.deleteMessage
);

export default router;