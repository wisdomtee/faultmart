import { Router } from "express";
import listingController from "./listing.controller";
import { authenticate } from "../../middleware/auth.middleware";
import upload from "../../middleware/upload";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: Marketplace listing management
 */

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: Get all listings
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Toyota
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listings retrieved successfully
 */
router.get("/", listingController.getListings);

/**
 * @swagger
 * /api/listings:
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - categoryId
 *               - price
 *               - condition
 *             properties:
 *               title:
 *                 type: string
 *                 example: Toyota Corolla 2010
 *               description:
 *                 type: string
 *                 example: Engine needs repair
 *               categoryId:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 2500000
 *               currency:
 *                 type: string
 *                 example: NGN
 *               condition:
 *                 type: string
 *                 example: FAULTY
 *               faultSeverity:
 *                 type: string
 *                 example: MAJOR
 *               faultDescription:
 *                 type: string
 *               location:
 *                 type: string
 *               state:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  upload.array("images", 10),
  listingController.createListing
);

/**
 * @swagger
 * /api/listings/me:
 *   get:
 *     summary: Get current user's listings
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User listings retrieved successfully
 */
router.get(
  "/me",
  authenticate,
  listingController.myListings
);

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     summary: Delete a listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *       404:
 *         description: Listing not found
 */
router.delete(
  "/:id",
  authenticate,
  listingController.deleteListing
);

/**
 * @swagger
 * /api/listings/id/{id}:
 *   get:
 *     summary: Get listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *       404:
 *         description: Listing not found
 */
router.get(
  "/id/:id",
  listingController.getListingById
);

/**
 * @swagger
 * /api/listings/{slug}:
 *   get:
 *     summary: Get listing by slug
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: toyota-corolla-2010
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *       404:
 *         description: Listing not found
 */
router.get(
  "/:slug",
  listingController.getListingBySlug
);

export default router;