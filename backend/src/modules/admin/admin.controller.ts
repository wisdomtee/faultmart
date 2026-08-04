import { Request, Response } from "express";

import {
  AuditAction,
  UserStatus,
  ListingStatus,
  ReportStatus
} from "@prisma/client";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import adminService from "./admin.service";
import auditService from "../audit/audit.service";

class AdminController {


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



  getUsers = asyncHandler(
  async (req: Request, res: Response) => {

    const users =
      await adminService.getUsers(
        Number(req.query.page) || 1,
        Number(req.query.limit) || 20,
        req.query.search as string,
        req.query.status as UserStatus
      );


      return successResponse(
        res,
        users,
        "Users retrieved successfully."
      );

    }
  );



  updateUserStatus = asyncHandler(
    async (req: Request, res: Response) => {

      const user =
        await adminService.updateUserStatus(
          req.params.id,
          req.body.status
        );


      await auditService.createLog(
        req.user!.userId,
        AuditAction.UPDATE,
        "User",
        req.params.id,
        "Admin updated user status",
        {
          status: req.body.status
        }
      );


      return successResponse(
        res,
        user,
        "User status updated successfully."
      );

    }
  );



  getPendingListings = asyncHandler(
async (req: Request, res: Response) => {

const listings =
 await adminService.getListings(

   Number(req.query.page) || 1,

   Number(req.query.limit) || 20,

   req.query.search as string,

   req.query.status as ListingStatus

 );

      return successResponse(
        res,
        listings,
        "Pending listings retrieved successfully."
      );

    }
  );



  approveListing = asyncHandler(
    async (req: Request, res: Response) => {

      const listing =
        await adminService.updateListingStatus(
          req.params.id,
          "ACTIVE"
        );


      await auditService.createLog(
        req.user!.userId,
        AuditAction.APPROVE,
        "Listing",
        req.params.id,
        "Admin approved listing"
      );


      return successResponse(
        res,
        listing,
        "Listing approved successfully."
      );

    }
  );



  rejectListing = asyncHandler(
    async (req: Request, res: Response) => {

      const listing =
        await adminService.updateListingStatus(
          req.params.id,
          "REJECTED"
        );


      await auditService.createLog(
        req.user!.userId,
        AuditAction.REJECT,
        "Listing",
        req.params.id,
        "Admin rejected listing"
      );


      return successResponse(
        res,
        listing,
        "Listing rejected successfully."
      );

    }
  );



  getReports = asyncHandler(
async (req: Request, res: Response) => {

const reports =
 await adminService.getReports(

   Number(req.query.page) || 1,

   Number(req.query.limit) || 20,

   req.query.status as ReportStatus

 );

      return successResponse(
        res,
        reports,
        "Reports retrieved successfully."
      );

    }
  );



  updateReportStatus = asyncHandler(
    async (req: Request, res: Response) => {

      const report =
        await adminService.updateReportStatus(
          req.params.id,
          req.body.status
        );


      await auditService.createLog(
        req.user!.userId,
        AuditAction.UPDATE,
        "Report",
        req.params.id,
        "Admin updated report status",
        {
          status: req.body.status
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