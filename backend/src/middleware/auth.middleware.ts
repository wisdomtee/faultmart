import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError("Authentication required.", 401));
    }

    const token = authHeader.substring(7);

    console.log("TOKEN:", token);

    const payload = verifyAccessToken(token);

    console.log("PAYLOAD:", payload);

    req.user = payload;

    next();
  } catch (err) {
    console.log(err);
    return next(new AppError("Invalid or expired token.", 401));
  }
};