import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { listingService } from "./listing.service";

class ListingController {
  /**
   * POST /api/listings
   *
   * Create a new listing.
   */
  createListing = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("========== CREATE LISTING ==========");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const files = Array.isArray(req.files)
      ? req.files
      : [];

    console.log("FILE COUNT:", files.length);

    const data = {
      ...req.body,

      negotiable:
        req.body.negotiable === "true"
          ? true
          : req.body.negotiable === "false"
          ? false
          : undefined,
    };

    console.log("NORMALIZED DATA:", data);
    console.log(
      "NORMALIZED FILE COUNT:",
      files.length
    );

    const listing =
      await listingService.createListing(
        req.user.userId,
        data,
        files
      );

    return successResponse(
      res,
      listing,
      "Listing created successfully.",
      201
    );
  }
);
  /**
   * GET /api/listings
   *
   * Get listings with search, filtering,
   * sorting and pagination.
   */
  getListings = asyncHandler(
    async (req: Request, res: Response) => {
      const query = {
        page: req.query.page
          ? Number(req.query.page)
          : 1,

        limit: req.query.limit
          ? Number(req.query.limit)
          : 20,

        search: req.query.search as string,

        categoryId: req.query.categoryId as string,

        state: req.query.state as string,

        city: req.query.city as string,

        minPrice: req.query.minPrice
          ? Number(req.query.minPrice)
          : undefined,

        maxPrice: req.query.maxPrice
          ? Number(req.query.maxPrice)
          : undefined,

        condition: req.query.condition as any,

        faultSeverity: req.query.faultSeverity as any,

        sort: req.query.sort as any,

        status: req.query.status as any,
      };

      const listings =
        await listingService.getListings(query);

      return successResponse(
        res,
        listings,
        "Listings retrieved successfully."
      );
    }
  );

  /**
   * GET /api/listings/id/:id
   *
   * Get listing by ID.
   */
  getListingById = asyncHandler(
    async (req: Request, res: Response) => {
      const listing = await listingService.getListing(
        String(req.params.id)
      );

      return successResponse(
        res,
        listing,
        "Listing retrieved successfully."
      );
    }
  );

  /**
   * GET /api/listings/:slug
   *
   * Get listing by slug.
   */
  getListingBySlug = asyncHandler(
    async (req: Request, res: Response) => {
      const listing =
        await listingService.getListingBySlug(
          String(req.params.slug)
        );

      return successResponse(
        res,
        listing,
        "Listing retrieved successfully."
      );
    }
  );

  /**
   * GET /api/listings/me
   *
   * Get current seller's listings.
   */
  myListings = asyncHandler(
    async (req: Request, res: Response) => {
      const listings =
        await listingService.myListings(
          req.user.userId
        );

      return successResponse(
        res,
        listings,
        "Your listings retrieved successfully."
      );
    }
  );

  /**
   * PUT /api/listings/:id
   *
   * Update a listing.
   */
  updateListing = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("========== UPDATE LISTING ==========");
    console.log("LISTING ID:", req.params.id);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const files = Array.isArray(req.files)
      ? req.files
      : [];

    console.log("FILE COUNT:", files.length);

    const data: any = {
      ...req.body,
    };

    /**
     * Normalize multipart/form-data values.
     */
    if (req.body.price !== undefined) {
      data.price = Number(req.body.price);
    }

    if (req.body.negotiable !== undefined) {
      data.negotiable =
        req.body.negotiable === "true"
          ? true
          : req.body.negotiable === "false"
          ? false
          : undefined;
    }

    /**
     * Upload replacement images if supplied.
     */
    if (files.length > 0) {
      data.images =
        await listingService.uploadListingImages(
          files
        );
    }

    console.log("NORMALIZED UPDATE DATA:", data);

    const listing =
      await listingService.updateListing(
        String(req.params.id),
        req.user.userId,
        data
      );

    return successResponse(
      res,
      listing,
      "Listing updated successfully."
    );
  }
);

  /**
   * DELETE /api/listings/:id
   *
   * Soft delete a listing.
   */
  deleteListing = asyncHandler(
    async (req: Request, res: Response) => {
      await listingService.deleteListing(
        String(req.params.id),
        req.user.userId
      );

      return successResponse(
        res,
        null,
        "Listing deleted successfully."
      );
    }
  );
}

export default new ListingController();