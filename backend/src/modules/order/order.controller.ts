import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { orderService } from "./order.service";


class OrderController {


  /**
   * Create order
   * POST /api/orders
   */
  createOrder = asyncHandler(
    async (req: Request, res: Response) => {

      const order =
        await orderService.createOrder(
          req.user.userId,
          req.body
        );


      return successResponse(
        res,
        order,
        "Order created successfully.",
        201
      );

    }
  );





  /**
   * Get my orders
   * GET /api/orders
   */
  getMyOrders = asyncHandler(
    async (req: Request, res: Response) => {


      const orders =
        await orderService.getMyOrders(
          req.user.userId
        );


      return successResponse(
        res,
        orders,
        "Orders retrieved successfully."
      );

    }
  );





  /**
   * Get single order
   * GET /api/orders/:id
   */
  getOrderById = asyncHandler(
    async (req: Request, res: Response) => {


      const order =
        await orderService.getOrderById(
          String(req.params.id),
          req.user.userId
        );


      return successResponse(
        res,
        order,
        "Order retrieved successfully."
      );

    }
  );





  /**
   * Update order status
   * PATCH /api/orders/:id/status
   */
  updateStatus = asyncHandler(
    async (req: Request, res: Response) => {


      const order =
        await orderService.updateStatus(
          String(req.params.id),
          req.user.userId,
          req.body.status
        );


      return successResponse(
        res,
        order,
        "Order status updated successfully."
      );

    }
  );


  /**
   * Buyer confirms receipt
   * PATCH /api/orders/:id/confirm-receipt
   */
  confirmReceipt = asyncHandler(
    async (req: Request, res: Response) => {

      const order =
        await orderService.confirmReceipt(
          String(req.params.id),
          req.user.userId
        );

      return successResponse(
        res,
        order,
        "Order marked as received successfully."
      );

    }
  );


  /**
   * Cancel order
   * PATCH /api/orders/:id/cancel
   */
  cancelOrder = asyncHandler(
    async (req: Request, res: Response) => {


      const order =
        await orderService.cancelOrder(
          String(req.params.id),
          req.user.userId
        );


      return successResponse(
        res,
        order,
        "Order cancelled successfully."
      );

    }
  );

}



export const orderController =
  new OrderController();