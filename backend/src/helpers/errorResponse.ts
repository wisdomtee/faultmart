import { Response } from "express";


export function errorResponse(
  res: Response,
  message: string,
  status = 400,
  error?: unknown
) {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
}