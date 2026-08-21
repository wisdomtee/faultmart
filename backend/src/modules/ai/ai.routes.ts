import { Router } from "express";

import aiController from "./ai.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { listingAssistantSchema } from "./ai.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: FaultMart AI assistance
 */

/**
 * @swagger
 * /api/ai/listing-assistant:
 *   post:
 *     summary: Generate AI assistance for a listing
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *               faultSeverity:
 *                 type: string
 *               faultDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI listing assistance generated successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/listing-assistant",
  authenticate,
  validate(listingAssistantSchema),
  aiController.listingAssistant
);

export default router;
