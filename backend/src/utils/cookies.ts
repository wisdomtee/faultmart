import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

const REFRESH_COOKIE_NAME = "refreshToken";

export function setRefreshTokenCookie(
  res: Response,
  token: string
): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });
}

export function clearRefreshTokenCookie(
  res: Response
): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}

export { REFRESH_COOKIE_NAME };