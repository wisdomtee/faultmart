import { Router } from "express";

import reportController from "./report.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";

import {
  createReportSchema,
  updateReportStatusSchema,
} from "./report.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting listings, users and marketplace content
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a report
 *     description: Report a listing, user or other marketplace content.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - reportedId
 *               - reportedType
 *             properties:
 *               reportedId:
 *                 type: string
 *                 example: c6507aa6-8da1-478f-afc9-7d585d25e537
 *               reportedType:
 *                 type: string
 *                 example: LISTING
 *               reason:
 *                 type: string
 *                 example: Fraudulent listing
 *               description:
 *                 type: string
 *                 example: The seller uploaded misleading photos.
 *     responses:
 *       201:
 *         description: Report submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createReportSchema),
  reportController.createReport
);

/**
 * @swagger
 * /api/reports/me:
 *   get:
 *     summary: Get my reports
 *     description: Returns all reports created by the authenticated user.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  authenticate,
  reportController.getMyReports
);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     description: Returns a single report.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Report ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 */
router.get(
  "/:id",
  authenticate,
  reportController.getReportById
);

/**
 * @swagger
 * /api/reports/{id}/status:
 *   patch:
 *     summary: Update report status
 *     description: Update the status of a report (typically by an administrator).
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Report ID
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
 *                 example: RESOLVED
 *     responses:
 *       200:
 *         description: Report status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Report not found
 */
router.patch(
  "/:id/status",
  authenticate,
  validate(updateReportStatusSchema),
  reportController.updateReportStatus
);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     description: Deletes a report.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Report ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       404:
 *         description: Report not found
 */
router.delete(
  "/:id",
  authenticate,
  reportController.deleteReport
);

export default router;