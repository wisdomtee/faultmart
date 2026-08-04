import { Response } from "express";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function successResponse<T>(
  res: Response,
  data?: T,
  message = "Success",
  status = 200
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}


export function createdResponse<T>(
  res: Response,
  data?: T,
  message = "Created successfully"
) {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}


export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: Pagination
) {
  return res.status(200).json({
    success: true,
    data,
    pagination,
  });
}