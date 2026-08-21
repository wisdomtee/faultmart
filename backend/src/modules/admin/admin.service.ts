import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import {
  UserStatus,
  ListingStatus,
  ReportStatus,
  OrderStatus,
} from "@prisma/client";
class AdminService {
  /**
   * ============================================================
   * ADMIN DASHBOARD
   * ============================================================
   */
  async getDashboard() {
    const [
      totalUsers,
      activeUsers,
      totalListings,
      activeListings,
      pendingListings,
      totalOrders,
      deliveredOrders,
      revenue,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          status: UserStatus.ACTIVE,
        },
      }),

      prisma.listing.count(),

      prisma.listing.count({
        where: {
          status: ListingStatus.ACTIVE,
        },
      }),

      prisma.listing.count({
        where: {
          status: ListingStatus.PENDING,
        },
      }),

      prisma.order.count(),

      prisma.order.count({
        where: {
          status: OrderStatus.DELIVERED,
        },
      }),

      prisma.order.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: OrderStatus.DELIVERED,
        },
      }),

      prisma.auditLog.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },

      listings: {
        total: totalListings,
        active: activeListings,
        pending: pendingListings,
      },

      orders: {
        total: totalOrders,
        completed: deliveredOrders,
      },

      revenue: Number(revenue._sum.amount ?? 0),

      recentActivities,
    };
  }

  /**
   * ============================================================
   * GET USERS
   * ============================================================
   *
   * Supports:
   * - Pagination
   * - Search by first name
   * - Search by last name
   * - Search by email
   * - Status filtering
   *
   * Pagination is protected against invalid values.
   */
  async getUsers(
    page = 1,
    limit = 20,
    search?: string,
    status?: UserStatus
  ) {
    /**
     * Prevent invalid pagination values.
     *
     * Page:
     * minimum = 1
     *
     * Limit:
     * minimum = 1
     * maximum = 100
     */
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(
      Math.max(1, limit),
      100
    );

    const skip =
      (safePage - 1) * safeLimit;

    const where: any = {};

    /**
     * Search users.
     *
     * trim() prevents searches containing
     * only spaces from being sent to Prisma.
     */
    if (search?.trim()) {
      const searchTerm = search.trim();

      where.OR = [
        {
          firstName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    /**
     * Filter by status.
     */
    if (status) {
      where.status = status;
    }

    /**
     * Fetch users and total count in parallel.
     */
    const [users, total] =
      await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: safeLimit,

          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.user.count({
          where,
        }),
      ]);

    return {
      data: users,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(
          total / safeLimit
        ),
      },
    };
  }

  /**
   * ============================================================
   * UPDATE USER STATUS
   * ============================================================
   *
   * Admin can:
   * - Activate users
   * - Suspend users
   * - Ban users
   * - Set users to pending
   *
   * An admin cannot change their own account status.
   */
  async updateUserStatus(
    userId: string,
    status: UserStatus,
    adminId?: string
  ) {
    /**
     * Prevent an admin from accidentally
     * suspending/banning themselves.
     */
    if (
      adminId &&
      userId === adminId
    ) {
      throw new Error(
        "You cannot change your own account status."
      );
    }

    /**
     * Make sure the user exists before updating.
     */
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          role: true,
          status: true,
        },
      });

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    /**
     * Update status and return
     * the user information needed by
     * the admin frontend.
     */
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        status,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  /**
   * ============================================================
   * GET LISTINGS
   * ============================================================
   *
   * Supports:
   * - Pagination
   * - Search by title
   * - Listing status filtering
   */
  async getListings(
    page = 1,
    limit = 20,
    search?: string,
    status?: ListingStatus
  ) {
    /**
     * Protect pagination values.
     */
    const safePage = Math.max(1, page);

    const safeLimit = Math.min(
      Math.max(1, limit),
      100
    );

    const skip =
      (safePage - 1) * safeLimit;

    const where: any = {};

    /**
     * Search by listing title.
     */
    if (search?.trim()) {
      where.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    /**
     * Filter by listing status.
     */
    if (status) {
      where.status = status;
    }

    /**
     * Fetch listings and total count.
     */
    const [listings, total] =
      await Promise.all([
        prisma.listing.findMany({
          where,
          skip,
          take: safeLimit,

          include: {
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },

            images: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.listing.count({
          where,
        }),
      ]);

    return {
      data: listings,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(
          total / safeLimit
        ),
      },
    };
  }

  /**
   * ============================================================
   * UPDATE LISTING STATUS
   * ============================================================
   */
  async updateListingStatus(
    listingId: string,
    status: ListingStatus
  ) {
    /**
     * Make sure listing exists.
     */
    const listing =
      await prisma.listing.findUnique({
        where: {
          id: listingId,
        },

        select: {
          id: true,
        },
      });

    if (!listing) {
      throw new Error(
        "Listing not found."
      );
    }

    return prisma.listing.update({
      where: {
        id: listingId,
      },

      data: {
        status,
      },
    });
  }

    /**
   * ============================================================
   * GET ORDERS
   * ============================================================
   *
   * Supports:
   * - Pagination
   * - Search by order ID
   * - Search by buyer name/email
   * - Search by seller name/email
   * - Search by listing title
   * - Order status filtering
   */
  async getOrders(
    page = 1,
    limit = 20,
    search?: string,
    status?: OrderStatus
  ) {
    /**
     * Protect pagination values.
     */
    const safePage = Math.max(1, page);

    const safeLimit = Math.min(
      Math.max(1, limit),
      100
    );

    const skip =
      (safePage - 1) * safeLimit;

    const where: any = {};

    /**
     * Search orders across:
     * - Order ID
     * - Listing title
     * - Buyer name/email
     * - Seller name/email
     */
    if (search?.trim()) {
      const searchTerm = search.trim();

      where.OR = [
        {
          id: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          listing: {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          buyer: {
            firstName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          buyer: {
            lastName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          buyer: {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          seller: {
            firstName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          seller: {
            lastName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          seller: {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    /**
     * Filter by order status.
     */
    if (status) {
      where.status = status;
    }

    /**
     * Fetch orders and total count.
     */
    const [orders, total] =
      await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: safeLimit,

          include: {
            buyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },

            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },

            listing: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                currency: true,
              },
            },

            delivery: true,

            offer: {
              select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.order.count({
          where,
        }),
      ]);

    return {
      data: orders,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(
          total / safeLimit
        ),
      },
    };
  }

    /**
   * ============================================================
   * GET SINGLE ORDER
   * ============================================================
   */
  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },

        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },

        listing: {
          include: {
            images: true,
            vehicleDetail: true,
            applianceDetail: true,
          },
        },

        delivery: true,

        offer: {
          select: {
            id: true,
            amount: true,
            status: true,
            message: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError(
        "Order not found.",
        404
      );
    }

    return order;
  }

  /**
   * ============================================================
   * GET REPORTS
   * ============================================================
   *
   * Supports:
   * - Pagination
   * - Report status filtering
   */
  async getReports(
    page = 1,
    limit = 20,
    status?: ReportStatus
  ) {
    /**
     * Protect pagination values.
     */
    const safePage = Math.max(1, page);

    const safeLimit = Math.min(
      Math.max(1, limit),
      100
    );

    const skip =
      (safePage - 1) * safeLimit;

    const where: any = {};

    /**
     * Filter by report status.
     */
    if (status) {
      where.status = status;
    }

    /**
     * Fetch reports and total count.
     */
    const [reports, total] =
      await Promise.all([
        prisma.report.findMany({
          where,
          skip,
          take: safeLimit,

          include: {
  reporter: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },

  reportedUser: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },

  listing: {
    select: {
      id: true,
      title: true,
    },
  },
},

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.report.count({
          where,
        }),
      ]);

    return {
      data: reports,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(
          total / safeLimit
        ),
      },
    };
  }

  /**
   * ============================================================
   * UPDATE REPORT STATUS
   * ============================================================
   */
  async updateReportStatus(
    reportId: string,
    status: ReportStatus
  ) {
    /**
     * Make sure report exists.
     */
    const report =
      await prisma.report.findUnique({
        where: {
          id: reportId,
        },

        select: {
          id: true,
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
}

export default new AdminService();