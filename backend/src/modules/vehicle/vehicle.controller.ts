import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { vehicleService } from "./vehicle.service";

/**
 * Create vehicle details
 */
export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const result = await vehicleService.createVehicle(
    req.user.userId,
    String(req.params.listingId),
    req.body
  );

  return successResponse(
    res,
    result,
    "Vehicle details created successfully.",
    201
  );
});

/**
 * Get vehicle details
 */
export const getVehicle = asyncHandler(async (req: Request, res: Response) => {
  const result = await vehicleService.getVehicle(
    String(req.params.listingId)
  );

  return successResponse(
    res,
    result,
    "Vehicle details retrieved successfully."
  );
});

/**
 * Update vehicle details
 */
export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const result = await vehicleService.updateVehicle(
    req.user.userId,
    String(req.params.listingId),
    req.body
  );

  return successResponse(
    res,
    result,
    "Vehicle details updated successfully."
  );
});

/**
 * Delete vehicle details
 */
export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  const result = await vehicleService.deleteVehicle(
    req.user.userId,
    String(req.params.listingId)
  );

  return successResponse(
    res,
    result,
    result.message
  );
});