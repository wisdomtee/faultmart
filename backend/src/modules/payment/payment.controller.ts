import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { paymentService } from "./payment.service";


class PaymentController {


  /**
   * Create payment
   * POST /api/payments
   */
  createPayment = asyncHandler(
    async (req: Request, res: Response) => {


      const payment =
        await paymentService.createPayment(
          req.user.userId,
          req.body
        );


      return successResponse(
        res,
        payment,
        "Payment created successfully.",
        201
      );

    }
  );





  /**
   * Get payment for order
   * GET /api/payments/:orderId
   */
  getPayment = asyncHandler(
    async (req: Request, res: Response) => {


      const payment =
        await paymentService.getPayment(
          String(req.params.orderId),
          req.user.userId
        );


      return successResponse(
        res,
        payment,
        "Payment retrieved successfully."
      );

    }
  );





  /**
   * Verify/update payment
   * PATCH /api/payments/verify/:reference
   */
  verifyPayment = asyncHandler(
    async (req: Request, res: Response) => {


      const payment =
        await paymentService.updatePaymentStatus(
          String(req.params.reference),
          req.body.status
        );


      return successResponse(
        res,
        payment,
        "Payment status updated successfully."
      );

    }
  );

}



export const paymentController =
  new PaymentController();