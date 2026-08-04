import { ReviewType } from "@prisma/client";

export interface CreateReviewDto {
  orderId: string;
  rating: number;
  comment?: string;
  type: ReviewType;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

export interface ReviewQueryDto {
  page?: number;
  limit?: number;
}