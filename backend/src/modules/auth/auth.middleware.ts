import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

import { verifyAccessToken } from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authentication required.", 401);
    }

    const token = authHeader.substring(7);

    const payload = verifyAccessToken(token);

    req.user = payload;

    next();
  } catch {
    next(new AppError("Invalid or expired token.", 401));
  }
};

export const authorize =
  (...roles: Role[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new AppError("Unauthorized.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden.", 403));
    }

    next();
  };