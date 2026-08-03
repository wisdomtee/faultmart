import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";
import { offerService } from "./offer.service";

class OfferController {
  /**
   * POST /api/offers
   */
  createOffer = asyncHandler(async (req: Request, res: Response) => {
    const offer = await offerService.createOffer(
      req.user.userId,
      req.body
    );

    return successResponse(
      res,
      offer,
      "Offer submitted successfully.",
      201
    );
  });

  /**
   * GET /api/offers/my
   */
  getMyOffers = asyncHandler(async (req: Request, res: Response) => {
    const offers = await offerService.getMyOffers(
      req.user.userId
    );

    return successResponse(
      res,
      offers,
      "Your offers retrieved successfully."
    );
  });

  /**
   * GET /api/offers/received
   */
  getReceivedOffers = asyncHandler(async (req: Request, res: Response) => {
    const offers = await offerService.getReceivedOffers(
      req.user.userId
    );

    return successResponse(
      res,
      offers,
      "Received offers retrieved successfully."
    );
  });

  /**
   * PATCH /api/offers/:id/accept
   */
  acceptOffer = asyncHandler(async (req: Request, res: Response) => {
    const result = await offerService.acceptOffer(
      req.user.userId,
      req.params.id
    );

    return successResponse(
      res,
      result,
      "Offer accepted successfully."
    );
  });

  /**
   * PATCH /api/offers/:id/reject
   */
  rejectOffer = asyncHandler(async (req: Request, res: Response) => {
    const result = await offerService.rejectOffer(
      req.user.userId,
      req.params.id
    );

    return successResponse(
      res,
      result,
      "Offer rejected successfully."
    );
  });

  /**
   * PATCH /api/offers/:id/withdraw
   */
  withdrawOffer = asyncHandler(async (req: Request, res: Response) => {
    const result = await offerService.withdrawOffer(
      req.user.userId,
      req.params.id
    );

    return successResponse(
      res,
      result,
      "Offer withdrawn successfully."
    );
  });
}

export default new OfferController();