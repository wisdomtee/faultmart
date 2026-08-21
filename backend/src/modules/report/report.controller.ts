import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { reportService } from "./report.service";

class ReportController {
  /**
   * Create Report
   */
  createReport = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await reportService.createReport(
        req.user!.userId,
        req.body
      );

      return successResponse(
        res,
        result,
        "Report submitted successfully.",
        201
      );
    }
  );

  /**
   * Get My Reports
   */
  getMyReports = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await reportService.getMyReports(
          req.user!.userId
        );

      return successResponse(
        res,
        result,
        "Reports retrieved successfully."
      );
    }
  );

  /**
   * Get Single Report
   */
  getReportById = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await reportService.getReportById(
          String(req.params.id),
          req.user!.userId
        );

      return successResponse(
        res,
        result,
        "Report retrieved successfully."
      );
    }
  );

  /**
   * Update Report Status (Admin)
   */
  updateReportStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await reportService.updateReportStatus(
          String(req.params.id),
          req.body.status
        );

      return successResponse(
        res,
        result,
        "Report status updated successfully."
      );
    }
  );

  /**
   * Delete Report
   */
  deleteReport = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await reportService.deleteReport(
          String(req.params.id)
        );

      return successResponse(
        res,
        result,
        result.message
      );
    }
  );
}

export default new ReportController();