import {
  FaultSeverity,
  ListingCondition,
  ListingStatus,
} from "@prisma/client";

export interface ListingQueryDto {
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

  status?: ListingStatus;
}