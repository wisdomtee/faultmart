import { ListingStatus, OrderStatus } from "@prisma/client";

import { BaseRepository } from "../../repositories/BaseRepository";

export class DashboardRepository extends BaseRepository {
  getStats(userId: string) {
    return Promise.all([
      this.prisma.listing.count({
        where: {
          sellerId: userId,
          deletedAt: null,
        },
      }),

      this.prisma.listing.count({
        where: {
          sellerId: userId,
          status: ListingStatus.ACTIVE,
          deletedAt: null,
        },
      }),

      this.prisma.listing.count({
        where: {
          sellerId: userId,
          status: ListingStatus.SOLD,
          deletedAt: null,
        },
      }),

      this.prisma.listing.count({
        where: {
          sellerId: userId,
          status: ListingStatus.DRAFT,
          deletedAt: null,
        },
      }),

      this.prisma.listing.aggregate({
        where: {
          sellerId: userId,
          deletedAt: null,
        },
        _sum: {
          views: true,
        },
      }),

      this.prisma.favorite.count({
        where: {
          listing: {
            sellerId: userId,
          },
        },
      }),

      this.prisma.offer.count({
        where: {
          listing: {
            sellerId: userId,
          },
        },
      }),

      this.prisma.order.aggregate({
        where: {
          sellerId: userId,
          status: OrderStatus.DELIVERED,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);
  }

  getRecentListings(userId: string) {
    return this.prisma.listing.findMany({
      where: {
        sellerId: userId,
        deletedAt: null,
      },

      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        images: {
          take: 1,
          orderBy: {
            position: "asc",
          },
        },

        category: true,
      },
    });
  }

  getRecentOffers(userId: string) {
  console.log("DASHBOARD getRecentOffers userId:", userId);

  return this.prisma.offer.findMany({
    where: {
      listing: {
        sellerId: userId,
      },
    },

    take: 5,

    orderBy: {
      createdAt: "desc",
    },

      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },

        listing: {
  select: {
    id: true,
    title: true,
    slug: true,
    images: {
      take: 1,
      orderBy: {
        position: "asc",
      },
      select: {
        url: true,
      },
    },
  },
},
      },
    });
  }

  getRecentOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        sellerId: userId,
      },

      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },

        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

async getTopListings(userId: string) {
  return this.prisma.listing.findMany({
    where: {
      sellerId: userId,
      deletedAt: null,
    },

    orderBy: [
      {
        views: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: 5,

    include: {
      images: {
        take: 1,
        orderBy: {
          position: "asc",
        },
      },

      _count: {
        select: {
          favorites: true,
          offers: true,
        },
      },
    },
  });
}

async getLowPerformingListings(userId: string) {
  return this.prisma.listing.findMany({
    where: {
      sellerId: userId,
      deletedAt: null,
      status: ListingStatus.ACTIVE,
    },

    orderBy: {
      views: "asc",
    },

    take: 5,

    include: {
      images: {
        take: 1,
      },

      _count: {
        select: {
          favorites: true,
          offers: true,
        },
      },
    },
  });
}

async getSalesTrend(userId: string) {
  return this.prisma.order.groupBy({
    by: ["createdAt"],

    where: {
      sellerId: userId,
      status: OrderStatus.DELIVERED,
    },

    _sum: {
      amount: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}

async getMonthlyRevenue(userId: string) {
  return this.prisma.order.aggregate({
    where: {
      sellerId: userId,
      status: OrderStatus.DELIVERED,
    },

    _sum: {
      amount: true,
    },

    _count: true,
  });
}

async getListingPerformance(userId: string) {
  return this.prisma.listing.findMany({
    where: {
      sellerId: userId,
      deletedAt: null,
    },

    select: {
      id: true,
      title: true,
      slug: true,
      views: true,

      _count: {
        select: {
          favorites: true,
          offers: true,
        },
      },
    },

    orderBy: {
      views: "desc",
    },
  });
}

async getSellerDeliveries(userId: string) {
  return this.prisma.delivery.findMany({
    where: {
      order: {
        sellerId: userId,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 10,

    include: {
      order: {
        include: {
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },

          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}
}
export const dashboardRepository = new DashboardRepository();