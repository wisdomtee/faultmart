import {
  Currency,
  FaultSeverity,
  ListingCondition,
} from "@prisma/client";

/**
 * Uploaded image returned from Cloudinary
 */
export interface ListingImageDto {
  url: string;
  publicId: string;
}

/**
 * Create Listing DTO
 */
export interface CreateListingDto {
  title: string;

  description: string;

  categoryId: string;

  price: number;

  currency?: Currency;

  condition: ListingCondition;

  faultSeverity?: FaultSeverity;

  faultDescription?: string;

  location?: string;

  state?: string;

  city?: string;

  negotiable?: boolean;
}

/**
 * Update Listing DTO
 */
export interface UpdateListingDto {
  title?: string;

  description?: string;

  price?: number;

  currency?: Currency;

  condition?: ListingCondition;

  faultSeverity?: FaultSeverity;

  faultDescription?: string;

  location?: string;

  state?: string;

  city?: string;

  negotiable?: boolean;

  images?: ListingImageDto[];
}

/**
 * Listing Search / Filter DTO
 */
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
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNext: boolean;

  hasPrev: boolean;
}

/**
 * Paginated Response
 */
export interface PaginatedListingResponse<T> {
  items: T[];

  pagination: PaginationMeta;
}