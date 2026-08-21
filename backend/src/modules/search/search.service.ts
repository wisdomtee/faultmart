import { listingService } from "../listing/listing.service";

class SearchService {
  async search(query: any) {
    return listingService.getListings({
      search: query.q,
      categoryId: query.categoryId,
      state: query.state,
      city: query.city,
      condition: query.condition,
      faultSeverity: query.faultSeverity,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      page: query.page,
      limit: query.limit,
      sort: query.sort,
    });
  }
}

export default new SearchService();