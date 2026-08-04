import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(
        new AppError("Authentication required.", 401)
      );
    }

    const token = authHeader.substring(7);

    req.user = verifyAccessToken(token);

    next();
  } catch {
    return next(
      new AppError("Invalid or expired token.", 401)
    );
  }
};