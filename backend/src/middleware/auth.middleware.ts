import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log("========== AUTH ==========");
  console.log("Authorization:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No bearer token");
      return next(new AppError("Authentication required.", 401));
    }

    const token = authHeader.substring(7);

    console.log("TOKEN:", token);

    const payload = verifyAccessToken(token);

    console.log("PAYLOAD:", payload);

    req.user = payload;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);

    return next(new AppError("Invalid or expired token.", 401));
  }
};