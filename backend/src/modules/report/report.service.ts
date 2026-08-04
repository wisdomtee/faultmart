import {
  ReportStatus,
} from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import {
  CreateReportDto,
} from "./report.types";

class ReportService {
  /**
   * Create Report
   */
  async createReport(
    reporterId: string,
    data: CreateReportDto
  ) {
    // Cannot report both at once
    if (data.listingId && data.reportedUserId) {
      throw new AppError(
        "Report either a listing or a user, not both.",
        400
      );
    }

    // =========================
    // Report Listing
    // =========================
    if (data.listingId) {
      const listing =
        await prisma.listing.findUnique({
          where: {
            id: data.listingId,
          },
        });

      if (!listing) {
        throw new AppError(
          "Listing not found.",
          404
        );
      }

      if (listing.sellerId === reporterId) {
        throw new AppError(
          "You cannot report your own listing.",
          400
        );
      }

      const existing =
        await prisma.report.findFirst({
          where: {
            reporterId,
            listingId: data.listingId,
          },
        });

      if (existing) {
        throw new AppError(
          "You have already reported this listing.",
          400
        );
      }

      return prisma.report.create({
        data: {
          reporterId,
          listingId: data.listingId,
          reason: data.reason,
          description: data.description,
        },

        include: {
          listing: true,
          reporter: true,
        },
      });
    }

    // =========================
    // Report User
    // =========================
    if (data.reportedUserId) {
      if (data.reportedUserId === reporterId) {
        throw new AppError(
          "You cannot report yourself.",
          400
        );
      }

      const user =
        await prisma.user.findUnique({
          where: {
            id: data.reportedUserId,
          },
        });

      if (!user) {
        throw new AppError(
          "User not found.",
          404
        );
      }

      const existing =
        await prisma.report.findFirst({
          where: {
            reporterId,
            reportedUserId: data.reportedUserId,
          },
        });

      if (existing) {
        throw new AppError(
          "You have already reported this user.",
          400
        );
      }

      return prisma.report.create({
        data: {
          reporterId,
          reportedUserId: data.reportedUserId,
          reason: data.reason,
          description: data.description,
        },

        include: {
          reportedUser: true,
          reporter: true,
        },
      });
    }

    throw new AppError(
      "Nothing to report.",
      400
    );
  }

  /**
   * Get My Reports
   */
  async getMyReports(
    reporterId: string
  ) {
    return prisma.report.findMany({
      where: {
        reporterId,
      },

      include: {
        listing: true,

        reportedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get Report By ID
   */
  async getReportById(
    reportId: string,
    reporterId: string
  ) {
    const report =
      await prisma.report.findFirst({
        where: {
          id: reportId,
          reporterId,
        },

        include: {
          listing: true,
          reporter: true,
          reportedUser: true,
        },
      });

    if (!report) {
      throw new AppError(
        "Report not found.",
        404
      );
    }

    return report;
  }

  /**
   * Update Report Status (Admin)
   */
  async updateReportStatus(
    reportId: string,
    status: ReportStatus
  ) {
    const report =
      await prisma.report.findUnique({
        where: {
          id: reportId,
        },
      });

    if (!report) {
      throw new AppError(
        "Report not found.",
        404
      );
    }

    return prisma.report.update({
      where: {
        id: reportId,
      },

      data: {
        status,
      },
    });
  }

  /**
   * Delete Report
   */
  async deleteReport(
    reportId: string
  ) {
    const report =
      await prisma.report.findUnique({
        where: {
          id: reportId,
        },
      });

    if (!report) {
      throw new AppError(
        "Report not found.",
        404
      );
    }

    await prisma.report.delete({
      where: {
        id: reportId,
      },
    });

    return {
      message:
        "Report deleted successfully.",
    };
  }
}

export const reportService =
  new ReportService();