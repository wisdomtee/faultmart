import {
  Prisma,
  ListingStatus,
} from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CategoryListingQuery } from "./category.types";

class CategoryService {
  /*
   * Get all categories
   */
  async getCategories() {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      include: {
        _count: {
          select: {
            listings: {
              where: {
                status: ListingStatus.ACTIVE,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      listingCount: category._count.listings,
    }));
  }

  /*
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: {
        slug,
      },

      include: {
        _count: {
          select: {
            listings: {
              where: {
                status: ListingStatus.ACTIVE,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    return {
      ...category,
      listingCount: category._count.listings,
    };
  }

  /*
   * Category Listings
   */
  async getCategoryListings(
    slug: string,
    query: CategoryListingQuery
  ) {
    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, query.limit || 20);
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {
      categoryId: category.id,
      status: ListingStatus.ACTIVE,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (query.state) {
      where.state = {
        equals: query.state,
        mode: "insensitive",
      };
    }

    if (query.condition) {
      where.condition = query.condition;
    }

    if (query.faultSeverity) {
      where.faultSeverity = query.faultSeverity;
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {
        ...(query.minPrice && {
          gte: new Prisma.Decimal(query.minPrice),
        }),
        ...(query.maxPrice && {
          lte: new Prisma.Decimal(query.maxPrice),
        }),
      };
    }

    let orderBy: Prisma.ListingOrderByWithRelationInput = {
      createdAt: "desc",
    };

    switch (query.sort) {
      case "price_asc":
        orderBy = {
          price: "asc",
        };
        break;

      case "price_desc":
        orderBy = {
          price: "desc",
        };
        break;

      case "oldest":
        orderBy = {
          createdAt: "asc",
        };
        break;

      case "popular":
  orderBy = {
    views: "desc",
  };
  break;
    }

    const [items, total] = await prisma.$transaction([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy,

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
      }),

      prisma.listing.count({
        where,
      }),
    ]);

    return {
      category,

      items,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}

export default new CategoryService();