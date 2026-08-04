import prisma from "../../config/prisma";

class HomeService {

  async getHomepage() {

    const [

      featured,

      latest,

      popular,

      categories,

      statistics

    ] = await Promise.all([

      /**
       * Featured Listings
       */
      prisma.listing.findMany({

        where: {

          status: "ACTIVE",

          featured: true

        },

        take: 8,

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

      /**
       * Latest Listings
       */
      prisma.listing.findMany({

        where: {

          status: "ACTIVE"

        },

        take: 12,

        orderBy: {

          createdAt: "desc"

        },

        include: {

          images: true

        }

      }),

      /**
       * Popular Listings
       */
      prisma.listing.findMany({

        where: {

          status: "ACTIVE"

        },

        take: 12,

        orderBy: {

          views: "desc"

        },

        include: {

          images: true

        }

      }),

      /**
       * Categories
       */
      prisma.category.findMany({

        include: {

          _count: {

            select: {

              listings: true

            }

          }

        },

        orderBy: {

          name: "asc"

        }

      }),

      /**
       * Platform Statistics
       */
      Promise.all([

        prisma.user.count(),

        prisma.listing.count({

          where: {

            status: "ACTIVE"

          }

        }),

        prisma.order.count({

          where: {

            status: "DELIVERED"

          }

        }),

        prisma.review.count()

      ])

    ]);

    return {

      featured,

      latest,

      popular,

      categories,

      statistics: {

        users: statistics[0],

        listings: statistics[1],

        sold: statistics[2],

        reviews: statistics[3]

      }

    };

  }

}

export default new HomeService();