import { dashboardRepository } from "./dashboard.repository";

class DashboardService {
  async getDashboard(userId: string) {
    const [
      stats,
  recentListings,
  recentOffers,
  recentOrders,
  topListings,
  lowPerformingListings,
  salesTrend,
  monthlyRevenue,
  listingPerformance,
  deliveries,
    ] = await Promise.all([
      dashboardRepository.getStats(userId),
  dashboardRepository.getRecentListings(userId),
  dashboardRepository.getRecentOffers(userId),
  dashboardRepository.getRecentOrders(userId),
  dashboardRepository.getTopListings(userId),
  dashboardRepository.getLowPerformingListings(userId),
  dashboardRepository.getSalesTrend(userId),
  dashboardRepository.getMonthlyRevenue(userId),
  dashboardRepository.getListingPerformance(userId),
  dashboardRepository.getSellerDeliveries(userId),
    ]);

    const [
      totalListings,
      activeListings,
      soldListings,
      draftListings,
      views,
      favorites,
      offers,
      revenue,
    ] = stats;

    return {
  stats: {
    totalListings,
    activeListings,
    soldListings,
    draftListings,
    totalViews: views._sum.views ?? 0,
    totalFavorites: favorites,
    totalOffers: offers,
    totalRevenue: Number(revenue._sum.amount ?? 0),
  },

  analytics: {
    salesTrend,

    monthlyRevenue: {
      revenue: Number(monthlyRevenue._sum.amount ?? 0),
      orders: monthlyRevenue._count,
    },

    listingPerformance,
  },

  recentListings,

  deliveries,

  recentOffers,

  recentOrders,

  topListings,

  lowPerformingListings,
};
  }
}

export const dashboardService = new DashboardService();