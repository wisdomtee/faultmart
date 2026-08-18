import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { deliveryService } from "./delivery.service";


class DeliveryController {


  /**
   * Create delivery
   * POST /api/deliveries
   */
  createDelivery = asyncHandler(
    async (req: Request, res: Response) => {


      const delivery =
        await deliveryService.createDelivery(
          req.user.userId,
          req.body
        );


      return successResponse(
        res,
        delivery,
        "Delivery created successfully.",
        201
      );

    }
  );





  /**
   * Get delivery details
   * GET /api/deliveries/:orderId
   */
  getDelivery = asyncHandler(
    async (req: Request, res: Response) => {


      const delivery =
        await deliveryService.getDelivery(
          String(req.params.orderId),
          String(req.params.orderId)
        );


      return successResponse(
        res,
        delivery,
        "Delivery retrieved successfully."
      );

    }
  );





  /**
   * Update delivery status
   * PATCH /api/deliveries/:id/status
   */
  updateStatus = asyncHandler(
    async (req: Request, res: Response) => {


      const delivery =
        await deliveryService.updateStatus(
          String(req.params.orderId),
          req.user.userId,
          req.body.status
        );


      return successResponse(
        res,
        delivery,
        "Delivery status updated successfully."
      );

    }
  );

}



export const deliveryController =
  new DeliveryController();