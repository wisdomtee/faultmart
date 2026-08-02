import { Response } from "express";

export function successResponse(
  res: Response,
  data?: unknown,
  message = "Success",
  status = 200
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function createdResponse(
  res: Response,
  data?: unknown,
  message = "Created successfully"
) {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

export function paginatedResponse(
  res: Response,
  data: unknown[],
  pagination: unknown
) {
  return res.status(200).json({
    success: true,
    data,
    pagination,
  });
}