import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

const accessSecret: Secret = process.env.JWT_ACCESS_SECRET as Secret;
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET as Secret;

console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);

const accessExpiresIn =
  (process.env.ACCESS_TOKEN_EXPIRES || "15m") as SignOptions["expiresIn"];

const refreshExpiresIn =
  (process.env.REFRESH_TOKEN_EXPIRES || "30d") as SignOptions["expiresIn"];

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export function generateAccessToken(
  payload: JwtPayload
): string {
  return jwt.sign(
    payload,
    accessSecret as string,
    {
      expiresIn:
        accessExpiresIn ?? "15m",
    }
  );
}

export function generateRefreshToken(
  payload: JwtPayload
): string {
  return jwt.sign(
    payload,
    refreshSecret as string,
    {
      expiresIn:
        refreshExpiresIn ?? "30d",
    }
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, accessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, refreshSecret) as JwtPayload;
}