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
        req.user!.id,
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
          req.user!.id
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
          req.params.id,
          req.user!.id
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
          req.params.id,
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
          req.params.id
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