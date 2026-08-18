import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewQueryDto,
} from "./review.types";

class ReviewService {

  /**
   * Create Review
   */
  async createReview(
    reviewerId: string,
    data: CreateReviewDto
  ) {

    const order = await prisma.order.findUnique({
      where: {
        id: data.orderId,
      },

      include: {
        buyer: true,
        seller: true,
        listing: true,
      },
    });

    if (!order) {
      throw new AppError(
        "Order not found.",
        404
      );
    }

    if (order.status !== "DELIVERED") {
  throw new AppError(
    "Order must be completed before leaving a review.",
    400
  );
}

    const existingReview =
      await prisma.review.findFirst({
        where: {
          orderId: order.id,
          reviewerId,
        },
      });

    if (existingReview) {
      throw new AppError(
        "You have already reviewed this order.",
        400
      );
    }

    let revieweeId = "";

    if (data.type === "BUYER_TO_SELLER") {
      if (order.buyerId !== reviewerId) {
        throw new AppError(
          "Only buyer can review seller.",
          403
        );
      }

      revieweeId = order.sellerId;

    } else {

      if (order.sellerId !== reviewerId) {
        throw new AppError(
          "Only seller can review buyer.",
          403
        );
      }

      revieweeId = order.buyerId;
    }

    return prisma.review.create({

      data: {

        orderId: order.id,

        reviewerId,

        revieweeId,

        listingId: order.listingId,

        rating: data.rating,

        comment: data.comment,

        type: data.type,

      },

      include: {

        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },

        reviewee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },

        listing: {
          include: {
            images: {
              take: 1,
            },
          },
        },

        order: true,

      },

    });

  }

  /**
   * Get Reviews for a User
   */
  async getUserReviews(
    userId: string,
    query: ReviewQueryDto
  ) {

    const page =
      Math.max(1, Number(query.page) || 1);

    const limit =
      Math.max(1, Number(query.limit) || 20);

    const skip =
      (page - 1) * limit;

    const [reviews, total] =
      await prisma.$transaction([

        prisma.review.findMany({

          where: {
            revieweeId: userId,
          },

          skip,

          take: limit,

          orderBy: {
            createdAt: "desc",
          },

          include: {

            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                profileImage: true,
              },
            },

            listing: {
              include: {
                images: {
                  take: 1,
                },
              },
            },

          },

        }),

        prisma.review.count({
          where: {
            revieweeId: userId,
          },
        }),

      ]);

    return {

      items: reviews,

      pagination: {

        page,

        limit,

        total,

        totalPages:
          Math.ceil(total / limit),

        hasNext:
          page < Math.ceil(total / limit),

        hasPrev:
          page > 1,

      },

    };

  }
    /**
   * Get Single Review
   */
  async getReviewById(
    reviewId: string
  ) {

    const review =
      await prisma.review.findUnique({

        where: {
          id: reviewId,
        },

        include: {

          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              profileImage: true,
            },
          },

          reviewee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              profileImage: true,
            },
          },

          listing: {
            include: {
              images: {
                take: 1,
              },
            },
          },

          order: true,

        },

      });

    if (!review) {
      throw new AppError(
        "Review not found.",
        404
      );
    }

    return review;

  }

  /**
   * Update Review
   */
  async updateReview(
    reviewId: string,
    reviewerId: string,
    data: UpdateReviewDto
  ) {

    const review =
      await prisma.review.findFirst({

        where: {
          id: reviewId,
          reviewerId,
        },

      });

    if (!review) {
      throw new AppError(
        "Review not found.",
        404
      );
    }

    return prisma.review.update({

      where: {
        id: reviewId,
      },

      data: {

        ...(data.rating !== undefined && {
          rating: data.rating,
        }),

        ...(data.comment !== undefined && {
          comment: data.comment,
        }),

      },

      include: {

        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },

        reviewee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },

        listing: {
          include: {
            images: {
              take: 1,
            },
          },
        },

      },

    });

  }

  /**
   * Delete Review
   */
  async deleteReview(
    reviewId: string,
    reviewerId: string
  ) {

    const review =
      await prisma.review.findFirst({

        where: {
          id: reviewId,
          reviewerId,
        },

      });

    if (!review) {
      throw new AppError(
        "Review not found.",
        404
      );
    }

    await prisma.review.delete({

      where: {
        id: reviewId,
      },

    });

    return {
      message: "Review deleted successfully.",
    };

  }
    /**
   * Get User Rating Summary
   */
  async getRatingSummary(
    userId: string
  ) {

    const reviews = await prisma.review.findMany({

      where: {
        revieweeId: userId,
      },

      select: {
        rating: true,
      },

    });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {

      return {

        averageRating: 0,

        totalReviews: 0,

        ratings: [
          { rating: 5, count: 0 },
          { rating: 4, count: 0 },
          { rating: 3, count: 0 },
          { rating: 2, count: 0 },
          { rating: 1, count: 0 },
        ],

      };

    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating =
      Number(
        (totalRating / totalReviews).toFixed(1)
      );

    const ratings = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter(
        (review) => review.rating === rating
      ).length,
    }));

    return {

      averageRating,

      totalReviews,

      ratings,

    };

  }

}

export const reviewService =
  new ReviewService();