import { Request, Response } from "express";

import {
  AuditAction,
  UserStatus,
  ListingStatus,
  ReportStatus,
} from "@prisma/client";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import adminService from "./admin.service";
import auditService from "../audit/audit.service";

class AdminController {
  /**
   * ============================================================
   * ADMIN DASHBOARD
   * ============================================================
   */
  getDashboard = asyncHandler(
    async (_req: Request, res: Response) => {
      const dashboard =
        await adminService.getDashboard();

      return successResponse(
        res,
        dashboard,
        "Dashboard statistics retrieved successfully."
      );
    }
  );

  /**
   * ============================================================
   * GET USERS
   * ============================================================
   */
  getUsers = asyncHandler(
    async (req: Request, res: Response) => {
      const users =
        await adminService.getUsers(
          Number(req.query.page) || 1,
          Number(req.query.limit) || 20,
          typeof req.query.search === "string"
            ? req.query.search
            : undefined,
          typeof req.query.status === "string"
            ? (req.query.status as UserStatus)
            : undefined
        );

      return successResponse(
        res,
        users,
        "Users retrieved successfully."
      );
    }
  );

  /**
   * ============================================================
   * UPDATE USER STATUS
   * ============================================================
   */
  updateUserStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.params.id;

      if (typeof userId !== "string") {
        throw new Error("Invalid user ID.");
      }

      const user =
        await adminService.updateUserStatus(
          userId,
          req.body.status,
          req.user!.userId
        );

      await auditService.createLog(
        req.user!.userId,
        AuditAction.UPDATE,
        "User",
        userId,
        "Admin updated user status",
        {
          status: req.body.status,
        }
      );

      return successResponse(
        res,
        user,
        "User status updated successfully."
      );
    }
  );

  /**
   * ============================================================
   * GET LISTINGS
   * ============================================================
   */
  getPendingListings = asyncHandler(
    async (req: Request, res: Response) => {
      const listings =
        await adminService.getListings(
          Number(req.query.page) || 1,
          Number(req.query.limit) || 20,
          typeof req.query.search === "string"
            ? req.query.search
            : undefined,
          typeof req.query.status === "string"
            ? (req.query.status as ListingStatus)
            : undefined
        );

      return successResponse(
        res,
        listings,
        "Pending listings retrieved successfully."
      );
    }
  );

  /**
   * ============================================================
   * APPROVE LISTING
   * ============================================================
   */
  approveListing = asyncHandler(
    async (req: Request, res: Response) => {
      const listingId = req.params.id;

      if (typeof listingId !== "string") {
        throw new Error("Invalid listing ID.");
      }

      const listing =
        await adminService.updateListingStatus(
          listingId,
          ListingStatus.ACTIVE
        );

      await auditService.createLog(
        req.user!.userId,
        AuditAction.APPROVE,
        "Listing",
        listingId,
        "Admin approved listing"
      );

      return successResponse(
        res,
        listing,
        "Listing approved successfully."
      );
    }
  );

  /**
   * ============================================================
   * REJECT LISTING
   * ============================================================
   */
  rejectListing = asyncHandler(
    async (req: Request, res: Response) => {
      const listingId = req.params.id;

      if (typeof listingId !== "string") {
        throw new Error("Invalid listing ID.");
      }

      const listing =
        await adminService.updateListingStatus(
          listingId,
          ListingStatus.REJECTED
        );

      await auditService.createLog(
        req.user!.userId,
        AuditAction.REJECT,
        "Listing",
        listingId,
        "Admin rejected listing"
      );

      return successResponse(
        res,
        listing,
        "Listing rejected successfully."
      );
    }
  );

  /**
   * ============================================================
   * GET REPORTS
   * ============================================================
   */
  getReports = asyncHandler(
    async (req: Request, res: Response) => {
      const reports =
        await adminService.getReports(
          Number(req.query.page) || 1,
          Number(req.query.limit) || 20,
          typeof req.query.status === "string"
            ? (req.query.status as ReportStatus)
            : undefined
        );

      return successResponse(
        res,
        reports,
        "Reports retrieved successfully."
      );
    }
  );

  /**
   * ============================================================
   * UPDATE REPORT STATUS
   * ============================================================
   */
  updateReportStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const reportId = req.params.id;

      if (typeof reportId !== "string") {
        throw new Error("Invalid report ID.");
      }

      const report =
        await adminService.updateReportStatus(
          reportId,
          req.body.status
        );

      await auditService.createLog(
        req.user!.userId,
        AuditAction.UPDATE,
        "Report",
        reportId,
        "Admin updated report status",
        {
          status: req.body.status,
        }
      );

      return successResponse(
        res,
        report,
        "Report status updated successfully."
      );
    }
  );
}

export default new AdminController();
