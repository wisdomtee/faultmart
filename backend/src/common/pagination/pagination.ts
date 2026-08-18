export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export function paginate(
  query: PaginationQuery
): PaginationResult {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}