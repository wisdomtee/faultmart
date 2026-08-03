export interface CreateOfferDto {
  listingId: string;
  amount: number;
  message?: string;
}

export interface OfferQueryDto {
  page?: number;
  limit?: number;
  status?: string;
}