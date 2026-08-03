import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { ListingStatus } from "@prisma/client";

class FavoriteService {
  /**
   * Add listing to favorites
   */
  async addFavorite(userId: string, listingId: string) {
    // Check listing exists
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        deletedAt: null,
        status: ListingStatus.ACTIVE,
      },
    });

    if (!listing) {
      throw new AppError("Listing not found.", 404);
    }

    // Prevent duplicate favorites
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (existing) {
      throw new AppError(
        "Listing already added to favorites.",
        400
      );
    }

    return prisma.favorite.create({
      data: {
        userId,
        listingId,
      },
    });
  }

  /**
   * Remove favorite
   */
  async removeFavorite(userId: string, listingId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (!favorite) {
      throw new AppError(
        "Favorite not found.",
        404
      );
    }

    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    return {
      message: "Removed from favorites.",
    };
  }

  /**
   * Get current user's favorites
   */
  async getMyFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        listing: {
          include: {
            category: true,

            images: {
              take: 1,
              orderBy: {
                position: "asc",
              },
            },

            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get favorite count for a listing
   */
  async getFavoriteCount(listingId: string) {
    const count = await prisma.favorite.count({
      where: {
        listingId,
      },
    });

    return {
      count,
    };
  }

  /**
   * Check if listing is favorited
   */
  async isFavorited(
    userId: string,
    listingId: string
  ) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    return {
      isFavorited: !!favorite,
    };
  }
}

export const favoriteService = new FavoriteService();