import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { dashboardService } from "./dashboard.service";


class DashboardController {

  /**
   * GET /api/dashboard
   */
  getDashboard = asyncHandler(
    async (req: Request, res: Response) => {

      const dashboard =
        await dashboardService.getDashboard(
          req.user.userId
        );

      return successResponse(
        res,
        dashboard,
        "Dashboard retrieved successfully."
      );
    }
  );

}


export default new DashboardController();