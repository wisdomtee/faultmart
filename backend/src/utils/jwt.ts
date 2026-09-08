import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

function getAccessSecret(): Secret {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured.");
  }

  return secret;
}

function getRefreshSecret(): Secret {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not configured.");
  }

  return secret;
}

function getAccessExpiresIn(): SignOptions["expiresIn"] {
  return (process.env.ACCESS_TOKEN_EXPIRES || "15m") as SignOptions["expiresIn"];
}

function getRefreshExpiresIn(): SignOptions["expiresIn"] {
  return (process.env.REFRESH_TOKEN_EXPIRES || "30d") as SignOptions["expiresIn"];
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: getAccessExpiresIn(),
  });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: getRefreshExpiresIn(),
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getAccessSecret()) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, getRefreshSecret()) as JwtPayload;
}
