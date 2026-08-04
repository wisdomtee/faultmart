import { ReportReason } from "@prisma/client";

export interface CreateReportDto {
  listingId?: string;
  reportedUserId?: string;
  reason: ReportReason;
  description?: string;
}

export interface UpdateReportStatusDto {
  status: string;
}

export interface ReportQueryDto {
  page?: number;
  limit?: number;
  status?: string;
  reason?: string;
}