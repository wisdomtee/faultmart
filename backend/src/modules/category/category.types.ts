import {
  FaultSeverity,
  ListingCondition,
} from "@prisma/client";

export interface CategoryListingQuery {
  page?: number;
  limit?: number;

  search?: string;

  sort?:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "popular";

  state?: string;

  minPrice?: number;

  maxPrice?: number;

  condition?: ListingCondition;

  faultSeverity?: FaultSeverity;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  count: number;
}

export interface CategoryListingsResponse {
  category: CategoryDto;

  listings: any[];

  pagination: PaginationMeta;
}