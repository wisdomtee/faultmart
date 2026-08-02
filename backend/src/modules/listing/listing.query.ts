import {
  ListingCondition,
  FaultSeverity,
} from "@prisma/client";

export interface ListingQuery {
  page?: number;
  limit?: number;

  search?: string;

  categoryId?: string;

  state?: string;

  city?: string;

  minPrice?: number;

  maxPrice?: number;

  condition?: ListingCondition;

  faultSeverity?: FaultSeverity;

  sort?:
    | "latest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "most_viewed";
}