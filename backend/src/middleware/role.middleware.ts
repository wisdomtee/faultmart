import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

import { AppError } from "../utils/AppError";


export const requireRole = (...roles: Role[]) => {

  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {
      throw new AppError(
        "Authentication required.",
        401
      );
    }


    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "Access denied. Insufficient permissions.",
        403
      );
    }


    next();

  };

};