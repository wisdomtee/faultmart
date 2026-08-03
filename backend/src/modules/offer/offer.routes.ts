import { Router } from "express";
import offerController from "./offer.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

/**
 * All Offer routes require authentication
 */
router.use(authenticate);

/**
 * Buyer Routes
 */
router.post("/", offerController.createOffer);

router.get("/my", offerController.getMyOffers);

/**
 * Seller Routes
 */
router.get("/received", offerController.getReceivedOffers);

router.patch(
  "/:id/accept",
  offerController.acceptOffer
);

router.patch(
  "/:id/reject",
  offerController.rejectOffer
);

/**
 * Buyer Route
 */
router.patch(
  "/:id/withdraw",
  offerController.withdrawOffer
);

export default router;