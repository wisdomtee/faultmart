import { prisma } from "../../config/prisma";

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
  deletedAt: null,
},

  take: 8,

  orderBy: {

    views: "desc"

  },

  include: {
  images: true,

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
    },
  },
}

}),

      /**
       * Latest Listings
       */
      prisma.listing.findMany({

        where: {
  status: "ACTIVE",
  deletedAt: null,
},

        take: 12,

        orderBy: {

          createdAt: "desc"

        },

        include: {
  images: true,

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
    },
  },
}

      }),

      /**
       * Popular Listings
       */
      prisma.listing.findMany({

        where: {
  status: "ACTIVE",
  deletedAt: null,
},

        take: 12,

        orderBy: {

          views: "desc"

        },

        include: {
  images: true,

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
    },
  },
}

      }),

      /**
       * Categories
       */
      prisma.category.findMany({

        include: {

          _count: {

            select: {

                listings: {
                  where: {
                    status: "ACTIVE",
                    deletedAt: null,
                  },
                },

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
    status: "ACTIVE",
    deletedAt: null,
  },
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
