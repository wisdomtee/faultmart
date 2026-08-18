import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message = "Created successfully"
  ) {
    return this.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T,
    meta: PaginationMeta,
    message = "Success"
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static error(
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
    errors?: unknown
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}