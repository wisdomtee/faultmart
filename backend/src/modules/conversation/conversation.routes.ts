import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";

import { conversationController } from "./conversation.controller";
import { createConversationSchema } from "./conversation.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Buyer and seller conversations
 */

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create a new conversation
 *     description: Starts a conversation between a buyer and seller for a listing.
 *     tags: [Conversations]
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
 *               - receiverId
 *             properties:
 *               listingId:
 *                 type: string
 *                 example: c6507aa6-8da1-478f-afc9-7d585d25e537
 *               receiverId:
 *                 type: string
 *                 example: cfafb620-57c9-4027-8e1b-29b2a1e3c9f5
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createConversationSchema),
  conversationController.createConversation
);

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Get my conversations
 *     description: Returns all conversations for the authenticated user.
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticate,
  conversationController.getMyConversations
);

/**
 * @swagger
 * /api/conversations/{id}:
 *   get:
 *     summary: Get a conversation by ID
 *     description: Returns a single conversation including its participants.
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *       404:
 *         description: Conversation not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  authenticate,
  conversationController.getConversation
);

export default router;