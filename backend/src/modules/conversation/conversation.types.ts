export interface CreateConversationDto {
  listingId: string;
  sellerId: string;
}

export interface ConversationQueryDto {
  page?: number;
  limit?: number;
}