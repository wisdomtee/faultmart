import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

class SearchService {

  async search(query: any) {

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {
  status: "ACTIVE"
};


/**
 * Keyword Search
 */
if (query.q) {

  where.OR = [

    {
      title: {
        contains: query.q,
        mode: "insensitive"
      }
    },

    {
      description: {
        contains: query.q,
        mode: "insensitive"
      }
    },

    {
      faultDescription: {
        contains: query.q,
        mode: "insensitive"
      }
    }

  ];

}


/**
 * Category
 */
if (query.categoryId) {

  where.categoryId = query.categoryId;

}


/**
 * State
 */
if (query.state) {

  where.state = {
    equals: query.state,
    mode: "insensitive"
  };

}


/**
 * Listing Condition
 */
if (query.condition) {

  where.condition = query.condition;

}


/**
 * Fault Severity
 */
if (query.faultSeverity) {

  where.faultSeverity = query.faultSeverity;

}


/**
 * Price Range
 */
if (query.minPrice || query.maxPrice) {

  where.price = {};

  if (query.minPrice) {

    where.price.gte = Number(query.minPrice);

  }

  if (query.maxPrice) {

    where.price.lte = Number(query.maxPrice);

  }

}

    if (query.q) {

      where.OR = [

        {
          title: {
            contains: query.q,
            mode: "insensitive"
          }
        },

        {
          description: {
            contains: query.q,
            mode: "insensitive"
          }
        },

        {
          faultDescription: {
            contains: query.q,
            mode: "insensitive"
          }
        }

      ];

    }

    const orderBy: Prisma.ListingOrderByWithRelationInput = {};

    switch (query.sort) {

      case "priceAsc":
        orderBy.price = "asc";
        break;

      case "priceDesc":
        orderBy.price = "desc";
        break;

      case "oldest":
        orderBy.createdAt = "asc";
        break;

      default:
        orderBy.createdAt = "desc";
    }

    const [items, total] = await Promise.all([

      prisma.listing.findMany({

        where,

        skip,

        take: limit,

        orderBy,

        include: {

          images: true,

          seller: {
            select: {
              id: true,
              name: true,
              rating: true
            }
          }

        }

      }),

      prisma.listing.count({
        where
      })

    ]);

    return {

      items,

      pagination: {

        page,

        limit,

        total,

        pages: Math.ceil(total / limit)

      }

    };

  }

}

export default new SearchService();