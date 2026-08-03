import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";
import { listingService } from "./listing.service";

class ListingController {
  /**
   * POST /api/listings
   */
  createListing = asyncHandler(async (req: Request, res: Response) => {
    console.log("Controller user:", req.user);
    console.log("Seller ID:", req.user.userId);

    const listing = await listingService.createListing(
      req.user.userId,
      req.body,
      req.files as Express.Multer.File[]
    );

    return successResponse(
      res,
      listing,
      "Listing created successfully.",
      201
    );
  });

  /**
   * GET /api/listings
   */
  getListings = asyncHandler(async (req: Request, res:Response) => {
    const listings = await listingService.getListings(req.query);

    return successResponse(
      res,
      listings,
      "Listings retrieved successfully."
    );
  });

  /**
   * GET /api/listings/:id
   */
  getListingById = asyncHandler(async (req: Request, res: Response) => {
    const listing = await listingService.getListing(
      String(req.params.id)
    );

    return successResponse(
      res,
      listing,
      "Listing retrieved successfully."
    );
  });

  /**
   * GET /api/listings/slug/:slug
   */
  getListingBySlug = asyncHandler(async (req: Request, res: Response) => {
    const listing = await listingService.getListingBySlug(
      String(req.params.slug)
    );

    return successResponse(
      res,
      listing,
      "Listing retrieved successfully."
    );
  });

  /**
   * GET /api/listings/me
   */
  myListings = asyncHandler(async (req: Request, res: Response) => {
    const listings = await listingService.myListings(
      req.user.userId
    );

    return successResponse(
      res,
      listings,
      "Your listings retrieved successfully."
    );
  });

  /**
   * DELETE /api/listings/:id
   */
  deleteListing = asyncHandler(async (req: Request, res: Response) => {
    await listingService.deleteListing(
       String(req.params.id),
      req.user.userId
    );

    return successResponse(
      res,
      null,
      "Listing deleted successfully."
    );
  });
}

export default new ListingController();